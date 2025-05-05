// controllers/paymentController.js
const Stripe = require("stripe");
const Payment = require('../Models/Payment');
const Course = require('../Models/Course');
const VideoCourse = require('../Models/VideoCourse');
const Product = require('../Models/Product');
const User = require('../Models/User');
const Order = require('../Models/Order');
const Enrollment = require('../Models/Enrollment');
const Schedule = require('../Models/Schedule');
const Notification = require('../Models/Notification');

console.log('Payment controller loaded');

const dotenv = require('dotenv');
dotenv.config();
// console.log(process.env.STRIPE_SECRET_KEY)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


/**
 * Fonction d'aide pour gérer les paiements réussis
 */
async function handleSuccessfulPayment(session) {
  try {
    const { paymentType, userId, courseId, orderId, packageType, quantity, scheduleIds } = session.metadata;
    
    // Créer un enregistrement de paiement
    const paymentData = {
      stripeSessionId: session.id,
      stripeCustomerId: session.customer,
      user: userId,
      email: session.customer_details.email,
      amount: session.amount_total / 100, // Convertir les centimes en euros
      currency: session.currency,
      status: 'succeeded',
      receiptUrl: session.receipt_url,
      type: paymentType,
    };

    // Traiter selon le type de paiement
    if (paymentType === 'course') {
      const course = await Course.findById(courseId);
      
      paymentData.items = [{
        itemType: 'Course',
        itemId: courseId,
        quantity: 1,
        price: course.price
      }];
      
      const payment = await Payment.create(paymentData);

      // Créer une inscription au cours
      const enrollmentData = {
        student: userId,
        course: courseId,
        package: {
          type: packageType,
          quantity: parseInt(quantity),
          remainingSessions: parseInt(quantity)
        },
        status: 'confirmed',
        paymentId: payment._id,
        startDate: new Date()
      };

      // Si des créneaux spécifiques ont été sélectionnés
      if (scheduleIds && scheduleIds !== '') {
        const parsedScheduleIds = JSON.parse(scheduleIds);
        enrollmentData.schedules = parsedScheduleIds;
        
        // Mettre à jour les créneaux avec l'étudiant inscrit
        await Promise.all(parsedScheduleIds.map(async (scheduleId) => {
          await Schedule.findByIdAndUpdate(
            scheduleId,
            { 
              $push: { enrolledStudents: { student: userId, enrollmentDate: new Date() } },
              $inc: { currentCapacity: 1 } 
            }
          );
        }));
      }

      const enrollment = await Enrollment.create(enrollmentData);

      // Créer une notification pour l'étudiant
      await Notification.create({
        user: userId,
        type: 'payment_received',
        title: 'Paiement confirmé',
        message: `Votre paiement pour le cours "${course.title}" a été confirmé.`,
        relatedTo: {
          model: 'Course',
          id: courseId
        }
      });

      // Créer une notification pour le professeur
      await Notification.create({
        user: course.professor,
        type: 'new_enrollment',
        title: 'Nouvel étudiant inscrit',
        message: `Un nouvel étudiant s'est inscrit à votre cours "${course.title}".`,
        relatedTo: {
          model: 'Course',
          id: courseId
        }
      });
    }
    else if (paymentType === 'videoCourse') {
      const videoCourse = await VideoCourse.findById(courseId);
      
      paymentData.items = [{
        itemType: 'VideoCourse',
        itemId: courseId,
        quantity: 1,
        price: videoCourse.price
      }];
      
      const payment = await Payment.create(paymentData);

      // Logique pour donner accès au cours vidéo
      // Dans un modèle réel, vous pourriez vouloir créer une table d'accès spécifique
      await User.findByIdAndUpdate(userId, {
        $addToSet: { purchasedVideoCourses: courseId }
      });

      // Créer une notification
      await Notification.create({
        user: userId,
        type: 'payment_received',
        title: 'Accès au cours vidéo',
        message: `Votre accès au cours vidéo "${videoCourse.title}" est maintenant disponible.`,
        relatedTo: {
          model: 'VideoCourse',
          id: courseId
        }
      });
    }
    else if (paymentType === 'order') {
      const order = await Order.findById(orderId).populate('products.product');
      
      paymentData.items = order.products.map(item => ({
        itemType: 'Product',
        itemId: item.product._id,
        quantity: item.quantity,
        price: item.product.price
      }));
      
      const payment = await Payment.create(paymentData);

      // Mettre à jour le statut de la commande
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: 'payé'
      });

      // Mettre à jour le stock des produits
      for (const item of order.products) {
        await Product.findByIdAndUpdate(item.product._id, {
          $inc: { stock: -item.quantity }
        });
      }

      // Créer une notification
      await Notification.create({
        user: userId,
        type: 'payment_received',
        title: 'Commande confirmée',
        message: `Votre paiement pour la commande #${order._id.toString().slice(-6)} a été confirmé.`,
        relatedTo: {
          model: 'Order',
          id: orderId
        }
      });
    }
  } catch (error) {
    console.error('Erreur traitement paiement réussi:', error);
  }
}

/**
 * Fonction d'aide pour gérer les remboursements
 */
async function handleRefund(charge) {
  try {
    // Trouver le paiement associé
    const payment = await Payment.findOne({ stripeSessionId: charge.payment_intent });
    
    if (!payment) return;
    
    // Mettre à jour le statut du paiement
    const isPartialRefund = charge.amount_refunded < charge.amount;
    payment.status = isPartialRefund ? 'partially_refunded' : 'refunded';
    payment.refundId = charge.refunds.data[0].id;
    payment.refundAmount = charge.amount_refunded / 100; // Convertir en euros
    await payment.save();

    // Actions spécifiques selon le type de paiement
    if (payment.type === 'course') {
      const enrollment = await Enrollment.findOne({ paymentId: payment._id });
      if (enrollment) {
        enrollment.status = 'refunded';
        await enrollment.save();
        
        // Libérer les créneaux
        if (enrollment.schedules && enrollment.schedules.length > 0) {
          await Promise.all(enrollment.schedules.map(async (scheduleId) => {
            await Schedule.findByIdAndUpdate(
              scheduleId,
              { 
                $pull: { enrolledStudents: { student: payment.user } },
                $inc: { currentCapacity: -1 } 
              }
            );
          }));
        }
      }
    }
    else if (payment.type === 'order') {
      // Identifier la commande et la mettre à jour
      const order = await Order.findOne({
        user: payment.user,
        paymentStatus: 'payé',
        // Trouver par date approximative
        createdAt: { $gte: new Date(payment.createdAt - 3600000), $lte: new Date(payment.createdAt + 3600000) }
      });
      
      if (order) {
        order.paymentStatus = 'remboursé';
        await order.save();

        // Vous pourriez vouloir remettre le stock à jour
        if (!isPartialRefund) {
          for (const item of order.products) {
            await Product.findByIdAndUpdate(item.product, {
              $inc: { stock: item.quantity }
            });
          }
        }
      }
    }

    // Notifier l'utilisateur
    await Notification.create({
      user: payment.user,
      type: 'refund_processed',
      title: 'Remboursement effectué',
      message: `Un remboursement de ${payment.refundAmount}€ a été traité pour votre paiement.`,
      relatedTo: {
        model: 'Payment',
        id: payment._id
      }
    });
  } catch (error) {
    console.error('Erreur traitement remboursement:', error);
  }
}


/**
 * Fonction d'aide pour gérer les actions post-remboursement
 */
async function handleRefundActions(payment, isPartialRefund) {
  try {
    if (payment.type === 'course') {
      const enrollment = await Enrollment.findOne({ paymentId: payment._id });
      if (enrollment) {
        // Si remboursement total, marquer l'inscription comme remboursée
        if (!isPartialRefund) {
          enrollment.status = 'refunded';
          await enrollment.save();
          
          // Libérer les créneaux
          if (enrollment.schedules && enrollment.schedules.length > 0) {
            await Promise.all(enrollment.schedules.map(async (scheduleId) => {
              await Schedule.findByIdAndUpdate(
                scheduleId,
                { 
                  $pull: { enrolledStudents: { student: payment.user } },
                  $inc: { currentCapacity: -1 } 
                }
              );
            }));
          }
        }
        // Pour un remboursement partiel, on pourrait ajuster le nombre de séances restantes
        else {
          // Logique spécifique au remboursement partiel...
        }
      }
    }
    else if (payment.type === 'product') {
      // Identifier la commande et la mettre à jour
      const order = await Order.findOne({
        user: payment.user,
        paymentStatus: 'payé',
        // Trouver par date approximative
        createdAt: { $gte: new Date(payment.createdAt - 3600000), $lte: new Date(payment.createdAt + 3600000) }
      });
      
      if (order) {
        order.paymentStatus = isPartialRefund ? 'partiellement_remboursé' : 'remboursé';
        await order.save();

        // Remettre le stock à jour pour un remboursement total
        if (!isPartialRefund) {
          for (const item of order.products) {
            await Product.findByIdAndUpdate(item.product, {
              $inc: { stock: item.quantity }
            });
          }
        }
      }
    }

    // Notifier l'utilisateur
    await Notification.create({
      user: payment.user,
      type: 'refund_processed',
      title: 'Remboursement effectué',
      message: `Un remboursement de ${payment.refundAmount}€ a été traité pour votre paiement${payment.refundReason ? ` : ${payment.refundReason}` : ''}.`,
      relatedTo: {
        model: 'Payment',
        id: payment._id
      }
    });
  } catch (error) {
    console.error('Erreur dans les actions post-remboursement:', error);
    throw error; // Remonter l'erreur
  }
}

/**
 * Crée une session de paiement Stripe pour un cours
 */
exports.createCourseCheckoutSession = async (req, res) => {
  // Créer une session de paiement
  try {
    const { courseId, scheduleIds, packageType, quantity } = req.body;

    console.log(req);
    
    if (!courseId || !req.user) {
      return res.status(400).json({ error: "Données manquantes" });
    }

    // Récupérer les infos du cours
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Cours non trouvé" });
    }

    // Calculer le prix en fonction du type de package
    let totalPrice = course.price;
    if (packageType === 'package') {
      totalPrice = course.price * quantity * 0.9; // Remise de 10% pour les packages
    } else if (packageType === 'subscription') {
      totalPrice = course.price * 0.85; // Remise de 15% pour les abonnements
    }

    // Créer la session Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: req.user.email,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: course.title,
              description: course.description,
              images: course.imageUrl ? [course.imageUrl] : [],
            },
            unit_amount: Math.round(totalPrice * 100), // en centimes, arrondi pour éviter les problèmes de décimales
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
      metadata: {
        paymentType: "course",
        courseId: courseId,
        userId: req.user._id.toString(),
        packageType: packageType || 'single',
        quantity: quantity || 1,
        scheduleIds: scheduleIds ? JSON.stringify(scheduleIds) : '',
      },
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error("Erreur création session Stripe:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Crée une session de paiement Stripe pour un cours vidéo
 */
exports.createVideoCourseCheckoutSession = async (req, res) => {
  try {
    const { courseId } = req.body;
    
    console.log(req);
    
    if (!courseId || !req.user) {
      return res.status(400).json({ error: "Données manquantes" });
    }

    // Récupérer les infos du cours vidéo
    const videoCourse = await VideoCourse.findById(courseId);
    if (!videoCourse) {
      return res.status(404).json({ error: "Cours vidéo non trouvé" });
    }

    // Créer la session Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: req.user.email,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: videoCourse.title,
              description: videoCourse.description,
              images: videoCourse.thumbnail ? [videoCourse.thumbnail] : [],
            },
            unit_amount: Math.round(videoCourse.price * 100), // en centimes
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
      metadata: {
        paymentType: "videoCourse",
        courseId: courseId,
        userId: req.user._id.toString(),
      },
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error("Erreur création session Stripe:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Crée une session de paiement Stripe pour une commande de produits
 */
exports.createProductsCheckoutSession = async (req, res) => {
  try {
    const { orderId } = req.params;

    console.log(req);
    
    const order = await Order.findById(orderId).populate("products.product");
    if (!order) {
      return res.status(404).json({ error: "Commande non trouvée" });
    }

    // Vérifier que l'utilisateur est bien le propriétaire de la commande
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Accès non autorisé" });
    }

    const lineItems = order.products.map(item => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.product.name,
          description: item.product.description || '',
          images: item.product.mainImage ? [item.product.mainImage] : [],
        },
        unit_amount: Math.round(item.product.price * 100), // en centimes
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: req.user.email,
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
      metadata: {
        paymentType: "order",
        orderId: orderId,
        userId: req.user._id.toString(),
      },
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error("Erreur création session Stripe pour produits:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Webhook Stripe pour gérer les événements de paiement
 */
exports.stripeWebhook = async (req, res) => {
  const signature = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody, // Assurez-vous que le corps brut est accessible
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`⚠️ Erreur de signature webhook: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Gestion des événements Stripe
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        await handleSuccessfulPayment(session);
        break;

      case 'charge.refunded':
        const charge = event.data.object;
        await handleRefund(charge);
        break;

      // Ajoutez d'autres cas selon vos besoins
      default:
        console.warn(`⚠️ Événement non géré: ${event.type}`);
        break;
    }

    // Répondre avec un statut 200 pour indiquer que l'événement a été traité
    res.status(200).send({ message: "l'événement a été traité" });
  } catch (error) {
    console.error(`Erreur lors du traitement de l'événement: ${error.message}`);
    res.status(500).send('Internal Server Error');
  }
};
/**
 * Récupérer l'historique des paiements d'un utilisateur
 */
exports.getUserPayments = async (req, res) => {
  try {
    // Vérifier les autorisations
    const userId = req.params.userId;
    // if (userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    //   return res.status(403).json({ error: "Accès non autorisé" });
    // }

    // Obtenir tous les paiements avec leurs références
    const payments = await Payment.find({ user: userId })
      .populate({
        path: 'items.itemId',
        refPath: 'items.itemType'
      })
      .sort({ createdAt: -1 });

      // console.log(payments);
    res.status(200).json({ data:payments, status:true });
  } catch (error) {
    console.error("Erreur récupération paiements:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Générer une facture PDF pour un paiement
 */
exports.generateInvoice = async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    // Vérifier que le paiement existe et appartient à l'utilisateur
    const payment = await Payment.findById(paymentId)
      .populate({
        path: 'items.itemId',
        refPath: 'items.itemType'
      })
      .populate('user');
    
    if (!payment) {
      return res.status(404).json({ error: "Paiement non trouvé" });
    }
    
    if (payment.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Accès non autorisé" });
    }

    // Utilisation d'une bibliothèque comme PDFKit pour générer la facture
    // Code pour générer le PDF...
    
    // Dans cet exemple, on simule juste une URL de téléchargement
    const invoiceUrl = `/api/download/invoice/${paymentId}`;
    
    // Mettre à jour l'URL de la facture dans la base de données
    payment.invoiceUrl = invoiceUrl;
    await payment.save();
    
    res.json({ url: invoiceUrl });
  } catch (error) {
    console.error("Erreur génération facture:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Générer un rapport de paiements pour l'administration
 */
exports.generatePaymentReport = async (req, res) => {
  try {

    // console.log(req);

    // Vérifier que l'utilisateur est admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Accès non autorisé" });
    }

    // Paramètres de filtrage
    const { startDate, endDate, type, status } = req.query;
    
    // Construire le filtre
    const filter = {};
    
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else if (startDate) {
      filter.createdAt = { $gte: new Date(startDate) };
    } else if (endDate) {
      filter.createdAt = { $lte: new Date(endDate) };
    }
    
    if (type) filter.type = type;
    if (status) filter.status = status;

    // Récupérer les paiements
    const payments = await Payment.find(filter)
      .populate('user', 'firstname lastname email')
      .populate({
        path: 'items.itemId',
        refPath: 'items.itemType'
      })
      .sort({ createdAt: -1 });

    // Générer des statistiques
    const stats = {
      total: payments.length,
      totalAmount: payments.reduce((sum, payment) => sum + payment.amount, 0),
      byStatus: {
        succeeded: payments.filter(p => p.status === 'succeeded').length,
        pending: payments.filter(p => p.status === 'pending').length,
        failed: payments.filter(p => p.status === 'failed').length,
        refunded: payments.filter(p => p.status === 'refunded').length,
        partially_refunded: payments.filter(p => p.status === 'partially_refunded').length
      },
      byType: {
        course: payments.filter(p => p.type === 'course').length,
        product: payments.filter(p => p.type === 'product').length,
        subscription: payments.filter(p => p.type === 'subscription').length,
        package: payments.filter(p => p.type === 'package').length
      }
    };

    res.json({ data: {
      payments, 
      stats
    }});
  } catch (error) {
    console.error("Erreur génération rapport de paiements:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Initier un remboursement
 */
exports.initiateRefund = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { amount, reason } = req.body;

    console.log(req);
    
    // Vérifier les autorisations (admin uniquement)
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Accès non autorisé" });
    }
    
    // Récupérer le paiement
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ error: "Paiement non trouvé" });
    }
    
    // Vérifier que le paiement peut être remboursé
    if (payment.status !== 'succeeded') {
      return res.status(400).json({ 
        error: "Seuls les paiements réussis peuvent être remboursés" 
      });
    }
    
    // Vérifier le montant du remboursement
    const refundAmount = amount || payment.amount;
    if (refundAmount <= 0 || refundAmount > payment.amount) {
      return res.status(400).json({ 
        error: "Montant de remboursement invalide" 
      });
    }

    // Créer le remboursement via Stripe
    const refund = await stripe.refunds.create({
      payment_intent: payment.stripeSessionId,
      amount: Math.round(refundAmount * 100), // Convertir en centimes
      reason: 'requested_by_customer'
    });

    // Mettre à jour le statut du paiement
    const isPartialRefund = refundAmount < payment.amount;
    payment.status = isPartialRefund ? 'partially_refunded' : 'refunded';
    payment.refundId = refund.id;
    payment.refundAmount = refundAmount;
    payment.refundReason = reason || 'Remboursement demandé par l\'administrateur';
    await payment.save();

    // Actions spécifiques selon le type de paiement
    await handleRefundActions(payment, isPartialRefund);

    res.json({ 
      success: true, 
      message: "Remboursement initié avec succès",
      refund
    });
  } catch (error) {
    console.error("Erreur initiation remboursement:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Récupérer les détails d'un paiement
 */
exports.getPaymentDetails = async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    const payment = await Payment.findById(paymentId)
      .populate('user', 'firstname lastname email phone')
      .populate({
        path: 'items.itemId',
        refPath: 'items.itemType'
      });
    
    if (!payment) {
      return res.status(404).json({ error: "Paiement non trouvé" });
    }
    
    // Vérifier les autorisations
    if (payment.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Accès non autorisé" });
    }
    
    res.json(payment);
  } catch (error) {
    console.error("Erreur récupération détails paiement:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Administration: statistiques de paiement
 */
exports.getPaymentStatistics = async (req, res) => {
  try {
    // // Vérifier que l'utilisateur est admin
    // if (req.user && req.user.role !== 'admin') {
    //   return res.status(403).json({ error: "Accès non autorisé" });
    // }
    
    const { period = 'monthly' } = req.query; // daily, weekly, monthly, yearly
    
    // Déterminer la période de regroupement
    let groupBy;
    let dateFormat;
    let startDate = new Date();
    let endDate = new Date();
    
    switch (period) {
      case 'daily':
        // Derniers 30 jours
        startDate.setDate(startDate.getDate() - 30);
        groupBy = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
        dateFormat = "%Y-%m-%d";
        break;
      case 'weekly':
        // Dernières 12 semaines
        startDate.setDate(startDate.getDate() - 84);
        groupBy = { 
          $dateToString: { 
            format: "%Y-W%U", 
            date: "$createdAt" 
          } 
        };
        dateFormat = "%Y-W%U";
        break;
      case 'monthly':
        // Derniers 12 mois
        startDate.setMonth(startDate.getMonth() - 12);
        groupBy = { $dateToString: { format: "%Y-%m", date: "$createdAt" } };
        dateFormat = "%Y-%m";
        break;
      case 'yearly':
        // Dernières 5 années
        startDate.setFullYear(startDate.getFullYear() - 5);
        groupBy = { $dateToString: { format: "%Y", date: "$createdAt" } };
        dateFormat = "%Y";
        break;
      default:
        // Par défaut, dernier mois
        startDate.setMonth(startDate.getMonth() - 1);
        groupBy = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
        dateFormat = "%Y-%m-%d";
    }
    
    // Agréger les données de paiement
    const paymentStats = await Payment.aggregate([
      { 
        $match: { 
          createdAt: { $gte: startDate, $lte: endDate },
          status: { $in: ['succeeded', 'refunded', 'partially_refunded'] }
        } 
      },
      {
        $group: {
          _id: {
            date: groupBy,
            type: "$type"
          },
          count: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
          refundedAmount: { 
            $sum: { 
              $cond: [
                { $in: ["$status", ["refunded", "partially_refunded"]] },
                { $ifNull: ["$refundAmount", 0] },
                0
              ]
            }
          }
        }
      },
      {
        $group: {
          _id: "$_id.date",
          types: {
            $push: {
              type: "$_id.type",
              count: "$count",
              amount: "$totalAmount",
              refundedAmount: "$refundedAmount"
            }
          },
          totalCount: { $sum: "$count" },
          totalAmount: { $sum: "$totalAmount" },
          totalRefunded: { $sum: "$refundedAmount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Générer des statistiques globales
    const overallStats = await Payment.aggregate([
      {
        $match: {
          status: { $in: ['succeeded', 'refunded', 'partially_refunded'] }
        }
      },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
          refundedAmount: { 
            $sum: { 
              $cond: [
                { $in: ["$status", ["refunded", "partially_refunded"]] },
                { $ifNull: ["$refundAmount", 0] },
                0
              ]
            }
          }
        }
      }
    ]);
    
    // Transformer les données pour le frontend
    const timeSeriesData = paymentStats.map(item => ({
      name: item._id,
      totalAmount: item.totalAmount,
      totalCount: item.totalCount,
      netAmount: item.totalAmount - item.totalRefunded,
      details: item.types
    }));
    
    res.status(200).json({
      success: true,
      data: {
        period,
        timeSeriesData,
        overallStats
      }
    });
  } catch (error) {
    console.error("Erreur récupération statistiques:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Vérifier le statut d'un paiement spécifique
 */
exports.checkPaymentStatus = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    // Vérifier la session Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (!session) {
      return res.status(404).json({ error: "Session de paiement non trouvée" });
    }
    
    // Chercher le paiement dans notre base de données
    const payment = await Payment.findOne({ stripeSessionId: sessionId });
    
    // Retourner les informations de statut
    res.json({
      stripeStatus: session.status,
      paymentStatus: session.payment_status,
      internalStatus: payment ? payment.status : "non_enregistré",
      customerId: session.customer,
      amountTotal: session.amount_total / 100, // Convertir en euros
      metadata: session.metadata
    });
  } catch (error) {
    console.error("Erreur vérification statut paiement:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    // console.log("Go !!!");
    const payments = await Payment.find().populate('stripeSessionId').exec();

    // console.log(payments);
    res.status(201).json({data: payments, success: false});
  } catch (error) {
    console.error("Erreur récupération paiements:", error);
    res.status(500).json({ error: error.message });
  }
}