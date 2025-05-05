const express = require("express");
const router = express.Router();
const paymentController = require("../Controllers/payment.controller");

// 📄 OPÉRATIONS DE PAIEMENT

// GET : Récupérer l'historique des paiements d’un utilisateur spécifique par ID
router.get("/history/:userId", paymentController.getUserPayments);

router.get('/', paymentController.getAllPayments);

// GET : Récupérer les détails d'un paiement
router.get('/details/:paymentId', paymentController.getPaymentDetails);

// GET : Récupérer des statistiques sur les paiements
router.get('/statistics', paymentController.getPaymentStatistics);

// GET : Vérifier le statut d'un paiement
router.get('/status/:sessionId', paymentController.checkPaymentStatus);


// POST : Initier un remboursement
router.post('/initiate-refund/:paymentId', paymentController.initiateRefund);

// POST : Générer une facture
router.post('/generate-invoice/:paymentId', paymentController.generateInvoice);

// POST : Générer des rapports de paiement
router.post('/generate-payment-reports/:paymentId', paymentController.generatePaymentReport);

// POST : Créer une session de paiement pour un cours
router.post("courses/create-checkout-session", paymentController.createCourseCheckoutSession);

// POST : Créer une session de paiement pour des produits
router.post('/products/create-checkout-session/:orderId', paymentController.createProductsCheckoutSession);

// POST : Créer une session de paiement pour un cours vidéo spécifique par ID de commande
router.post("/videoCourses/create-checkout-session", paymentController.createVideoCourseCheckoutSession);

module.exports = router;