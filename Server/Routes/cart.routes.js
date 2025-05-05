const express = require("express");
const router = express.Router();
const cartController = require('../Controllers/cart.controller');

// ➕ Ajouter un produit au panier
router.post("/:userId", cartController.addItemToCart);

router.post("/create-cart", cartController.createCart)


// 📄 Voir le panier d’un utilisateur
router.get("/:userId", cartController.getUserCart);

router.get("/total-items/:userId", cartController.countCartItems)


// 📝 Modifier la quantité d’un item
router.put("/:userId", cartController.updateCartItem);


// ❌ Supprimer un item du panier
router.delete("/:userId/:itemType/:itemId", cartController.removeCartItem);

// ❌ Vider le panier après commande
router.delete("/clear/:userId", cartController.clearCart);

module.exports = router;
