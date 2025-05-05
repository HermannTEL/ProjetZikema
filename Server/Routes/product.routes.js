const express = require("express");
const router = express.Router();
const productController = require('../Controllers/product.controller');

// 📄 OPÉRATIONS SUR LES PRODUITS

// GET : Récupérer tous les produits
router.get("/", productController.getAllProducts);

// GET : Récupérer un produit par son ID
router.get("/:id", productController.getProductById);

// GET : Récupérer toutes les catégories de produits
router.get("/categories", productController.getCategories);

// GET : Récupérer toutes les sous-catégories de produits
router.get("/subcategories", productController.getSubcategories);

// GET : Récupérer toutes les marques de produits
router.get("/brands", productController.getBrands);

// GET : Récupérer tous les produits disponibles à la location
router.get("/rentable", productController.getRentableProducts);

// GET : Récupérer des produits similaires à un produit donné
router.get("/similar/:id", productController.getSimilarProducts);


// POST : Créer un nouveau produit
router.post("/", productController.createProduct);

// POST : Rechercher des produits
router.post("/search", productController.searchProducts);


// PUT : Modifier un produit par ID
router.put("/:id", productController.updateProduct);

// PUT : Mettre à jour le stock d'un produit par ID
router.put("/stock/:id", productController.updateStock);

// PUT : Mettre à jour le statut d'un produit par ID
router.put("/status/:id", productController.updateStatus);

// PUT : Mettre à jour les prix de location d'un produit par ID
router.put("/rental-prices/:id", productController.updateRentalPrices);


// DELETE : Supprimer un produit par ID
router.delete("/:id", productController.deleteProduct);

module.exports = router;