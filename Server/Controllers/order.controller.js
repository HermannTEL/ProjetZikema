// controllers/orderController.js
const Order = require("../Models/Order");
const Product = require("../Models/Product");
const Cart = require("../Models/Cart");
const Notification = require("../Models/Notification");

console.log("Order controller loaded");

/**
 * Créer une nouvelle commande
 */
exports.createOrder = async (req, res) => {
  try {
    // Assurer que l'ID utilisateur provient de l'authentification
    req.body.user = req.user._id;
    
    // Vérifier que les produits existent et sont en stock
    const products = req.body.products || [];
    if (products.length === 0) {
      return res.status(400).json({ error: "La commande doit contenir au moins un produit" });
    }
    
    let totalAmount = 0;
    
    // Vérifier chaque produit
    for (const item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ error: `Produit introuvable: ${item.product}` });
      }
      
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          error: `Stock insuffisant pour "${product.name}". Disponible: ${product.stock}, Demandé: ${item.quantity}` 
        });
      }
      
      totalAmount += product.price * item.quantity;
    }
    
    // Créer la commande
    const orderData = {
      user: req.user._id,
      products,
      totalAmount,
      paymentStatus: "en attente"
    };
    
    const order = await Order.create(orderData);
    
    // Ajouter une notification
    await Notification.create({
      user: req.user._id,
      type: 'order_created',
      title: 'Nouvelle commande',
      message: `Votre commande #${order._id.toString().slice(-6)} a été créée. Veuillez procéder au paiement.`,
      relatedTo: {
        model: 'Order',
        id: order._id
      }
    });
    
    res.status(201).json(order);
  } catch (error) {
    console.error("Erreur création commande:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Convertir le panier en commande
 */
exports.convertCartToOrder = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Récupérer le panier
    const cart = await Cart.findOne({ user: userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Le panier est vide" });
    }
    
    // Récupérer les détails des produits
    const populatedCart = await Cart.findOne({ user: userId }).populate({
      path: 'items.itemId',
      match: { itemType: 'product' }
    });
    
    // Filtrer les produits valides
    const productItems = populatedCart.items.filter(
      item => item.itemType === 'product' && item.itemId
    );
    
    if (productItems.length === 0) {
      return res.status(400).json({ error: "Aucun produit valide dans le panier" });
    }
    
    // Construire les données de produits pour la commande
    const products = [];
    let totalAmount = 0;
    
    for (const item of productItems) {
      const product = await Product.findById(item.itemId);
      
      // Vérifier le stock
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          error: `Stock insuffisant pour "${product.name}". Disponible: ${product.stock}, Demandé: ${item.quantity}` 
        });
      }
      
      products.push({
        product: item.itemId,
        quantity: item.quantity
      });
      
      totalAmount += product.price * item.quantity;
    }
    
    // Créer la commande
    const order = await Order.create({
      user: userId,
      products,
      totalAmount,
      paymentStatus: "en attente"
    });
    
    // Supprimer les produits du panier
    // Note: on supprime uniquement les produits qui ont été convertis en commande
    await Cart.findOneAndUpdate(
      { user: userId },
      { $pull: { items: { itemType: 'product' } } }
    );
    
    // Ajouter une notification
    await Notification.create({
      user: userId,
      type: 'order_created',
      title: 'Commande créée à partir du panier',
      message: `Votre commande #${order._id.toString().slice(-6)} a été créée. Veuillez procéder au paiement.`,
      relatedTo: {
        model: 'Order',
        id: order._id
      }
    });
    
    res.status(201).json({
      message: "Commande créée avec succès à partir du panier",
      order
    });
  } catch (error) {
    console.error("Erreur conversion panier:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Obtenir les commandes d'un utilisateur
 */
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // // Vérifier les autorisations
    // if (userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    //   return res.status(403).json({ error: "Accès non autorisé" });
    // }
    
    const orders = await Order.find({ user: userId })
      .populate('products.product')
      .sort({ createdAt: -1 });
      
    res.status(200).json({ data: orders, status: true });
  } catch (error) {
    console.error("Erreur récupération commandes:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Obtenir toutes les commandes (admin)
 */
exports.getAllOrders = async (req, res) => {
  try {
    // console.log(req);
    // // Vérifier que l'utilisateur est admin
    // if (req.user.role !== 'admin') {
    //   return res.status(403).json({ error: "Accès non autorisé" });
    // }
    
    // Paramètres de pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    // Filtres
    const filter = {};
    if (req.query.status) filter.paymentStatus = req.query.status;
    if (req.query.fromDate) filter.createdAt = { $gte: new Date(req.query.fromDate) };
    if (req.query.toDate) {
      if (filter.createdAt) {
        filter.createdAt.$lte = new Date(req.query.toDate);
      } else {
        filter.createdAt = { $lte: new Date(req.query.toDate) };
      }
    }
    
    // Récupérer les commandes avec pagination
    const orders = await Order.find(filter)
      .populate('user', 'firstname lastname email')
      .populate('products.product')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    // Compter le nombre total pour la pagination
    const total = await Order.countDocuments(filter);
    
    res.json({
      data: orders,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Erreur récupération commandes:", error.message);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Obtenir les détails d'une commande
 */
exports.getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findById(orderId)
      .populate('user', 'firstname lastname email phone address')
      .populate('products.product');
      
    if (!order) {
      return res.status(404).json({ error: "Commande non trouvée" });
    }
    
    // Vérifier les autorisations
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Accès non autorisé" });
    }
    
    res.json(order);
  } catch (error) {
    console.error("Erreur récupération commande:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Mettre à jour le statut d'une commande (admin)
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    
    // Vérifier que l'utilisateur est admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Accès non autorisé" });
    }
    
    // Valider le statut
    if (!['en attente', 'payé', 'expédié', 'livré', 'annulé', 'remboursé'].includes(status)) {
      return res.status(400).json({ error: "Statut non valide" });
    }
    
    const order = await Order.findByIdAndUpdate(
      orderId,
      { paymentStatus: status },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ error: "Commande non trouvée" });
    }
    
    // Créer une notification pour l'utilisateur
    await Notification.create({
      user: order.user,
      type: 'order_status_updated',
      title: 'Statut de commande mis à jour',
      message: `Le statut de votre commande #${order._id.toString().slice(-6)} a été mis à jour: ${status}`,
      relatedTo: {
        model: 'Order',
        id: order._id
      }
    });
    
    res.json(order);
  } catch (error) {
    console.error("Erreur mise à jour commande:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Annuler une commande
 */
exports.cancelOrder = async (req, res) => {
    try {
      const { orderId } = req.params;
      
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ error: "Commande non trouvée" });
      }
      
      // Vérifier les autorisations
      if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ error: "Accès non autorisé" });
      }
      
      // Vérifier que la commande peut être annulée
      if (order.paymentStatus !== 'en attente') {
        return res.status(400).json({ 
          error: "Impossible d'annuler une commande qui a déjà été traitée"
        });
      }
      
      // Mettre à jour le statut
      order.paymentStatus = 'annulé';
      await order.save();
      
      // Notification
      await Notification.create({
        user: order.user,
        type: 'order_cancelled',
        title: 'Commande annulée',
        message: `Votre commande #${order._id.toString().slice(-6)} a été annulée avec succès.`,
        relatedTo: {
          model: 'Order',
          id: order._id
        }
      });
      
      res.json({
        message: "Commande annulée avec succès",
        order
      });
    } catch (error) {
      console.error("Erreur annulation commande:", error);
      res.status(500).json({ error: error.message });
    }
};