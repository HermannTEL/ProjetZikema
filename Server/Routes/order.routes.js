const express = require("express");
const router = express.Router();
const orderController = require('../Controllers/order.controller');
const {auth} = require('../Conf/Middlewares/auth');

// 📄 OPÉRATIONS DE COMMANDES

// GET : Récupérer toutes les commandes d’un utilisateur spécifique par ID
router.get("/user/:userId", orderController.getUserOrders);

// GET : Récupérer toutes les commandes (accessible uniquement aux administrateurs)
router.get("/", auth(['admin']), orderController.getAllOrders);

// GET : Récupérer les détails d'une commande
router.get('/get-order-details/:orderId', orderController.getOrderDetails);


// POST : Créer une nouvelle commande
router.post("/", orderController.createOrder);

// POST : Créer une commande à partir du panier d'un utilisateur spécifique
router.post("/from-cart/:userId", orderController.convertCartToOrder);


// PUT : Modifier le statut d'une commande par ID
router.put("/update-status/:orderId", orderController.updateOrderStatus);


// DELETE : Annuler une commande par ID
router.delete("/cancel/:orderId", orderController.cancelOrder);

module.exports = router;
