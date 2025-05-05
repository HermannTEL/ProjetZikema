// controllers/productController.js
const Product = require('../Models/Product');
const { validationResult } = require('express-validator');

console.log('Product controller loaded');

// Récupérer tous les produits avec pagination et filtres
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        if (!products) {
            console.log("Aucun produit trouvé");
            return res.status(404).json({ message: "Aucun produit trouvé" });
        }
        // console.log(products);
        res.status(200).json({data: products, status: true});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Erreur lors de la récupération des produits'});
    }
}
// exports.getAllProducts = async (req, res) => {
//     try {
//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 10;
//         const skip = (page - 1) * limit;
        
//         // Construire les filtres
//         const filter = {};
        
//         if (req.query.category) {
//             filter.category = req.query.category;
//         }
        
//         if (req.query.subcategory) {
//             filter.subcategory = req.query.subcategory;
//         }
        
//         if (req.query.brand) {
//             filter.brand = req.query.brand;
//         }
        
//         if (req.query.isRentable === 'true') {
//             filter.isRentable = true;
//         }
        
//         if (req.query.minPrice || req.query.maxPrice) {
//             filter.price = {};
            
//             if (req.query.minPrice) {
//                 filter.price.$gte = parseInt(req.query.minPrice);
//             }
            
//             if (req.query.maxPrice) {
//                 filter.price.$lte = parseInt(req.query.maxPrice);
//             }
//         }
        
//         if (req.query.status) {
//             filter.status = req.query.status;
//         } else {
//             // Par défaut, afficher uniquement les produits disponibles
//             filter.status = 'available';
//         }
        
//         // Recherche par texte
//         if (req.query.search) {
//             filter.$text = { $search: req.query.search };
//         }
        
//         // Tri
//         let sort = {};
//         if (req.query.sort) {
//             if (req.query.sort === 'price_asc') {
//                 sort = { price: 1 };
//             } else if (req.query.sort === 'price_desc') {
//                 sort = { price: -1 };
//             } else if (req.query.sort === 'newest') {
//                 sort = { createdAt: -1 };
//             } else if (req.query.sort === 'name_asc') {
//                 sort = { name: 1 };
//             }
//         } else {
//             // Tri par défaut
//             sort = { createdAt: -1 };
//         }
        
//         // Exécuter la requête
//         const products = await Product.find(filter)
//         .sort(sort)
//         .skip(skip)
//         .limit(limit);
        
//         const total = await Product.countDocuments(filter);
        
//         res.status(200).json({
//             success: true,
//             count: products.length,
//             total,
//             data: products,
//             totalPages: Math.ceil(total / limit),
//             currentPage: page
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             error: error.message
//         });
//     }
// };

// Récupérer un produit par ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Produit non trouvé'
            });
        }
        
        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Créer un nouveau produit
exports.createProduct = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const product = await Product.create(req.body);
        
        res.status(201).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Mettre à jour un produit
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Produit non trouvé'
            });
        }
        
        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Supprimer un produit
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Produit non trouvé'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Produit supprimé avec succès'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Mettre à jour le stock d'un produit
exports.updateStock = async (req, res) => {
    try {
        const { stock } = req.body;
        
        if (stock === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Veuillez fournir une valeur de stock'
            });
        }
        
        const product = await Product.findByIdAndUpdate(
        req.params.id,
        { 
            stock,
            // Mettre à jour automatiquement le statut en fonction du stock
            status: stock > 0 ? 'available' : 'sold-out'
        },
        { new: true }
        );
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Produit non trouvé'
            });
        }
        
        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Obtenir les catégories de produits distinctes
exports.getCategories = async (req, res) => {
    try {
        const categories = await Product.distinct('category');
        
        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Obtenir les sous-catégories pour une catégorie donnée
exports.getSubcategories = async (req, res) => {
    try {
        const subcategories = await Product.distinct('subcategory');
        
        res.status(200).json({
            success: true,
            count: subcategories.length,
            data: subcategories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Obtenir les marques distinctes
exports.getBrands = async (req, res) => {
    try {
        const brands = await Product.distinct('brand');
        
        res.status(200).json({
            success: true,
            count: brands.length,
            data: brands
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Obtenir les produits disponibles à la location
exports.getRentableProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Page actuelle
        const limit = parseInt(req.query.limit) || 10; // Limite par page
        const skip = (page - 1) * limit; // Nombre d'éléments à ignorer

        const filter = { 
            isRentable: true,
            status: 'available',
            stock: { $gt: 0 }
        };

        // Si une catégorie est spécifiée, l'ajouter au filtre
        if (req.query.category) {
            filter.category = req.query.category;
        }

        console.log("Fetching rentable products...");

        // Récupérer les produits avec pagination
        const products = await Product.find(filter) // Appliquer le filtre ici
            .sort({ price: 1 }) // Trier par prix
            .skip(skip) // Ignorer les éléments précédents
            .limit(limit); // Limiter le nombre de résultats

        // Compter le nombre total de produits correspondant au filtre
        const total = await Product.countDocuments(filter);

        console.log(products);
        res.status(200).json({
            success: true,
            count: products.length,
            total,
            data: products,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error) {
        console.log("Erreur du serveur dans productController: ", error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Mettre à jour les prix de location d'un produit
exports.updateRentalPrices = async (req, res) => {
    try {
        const { rentalPrice } = req.body;
        
        if (!rentalPrice) {
            return res.status(400).json({
                success: false,
                message: 'Veuillez fournir les prix de location'
            });
        }
        
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { isRentable: true, rentalPrice },
            { new: true }
        );
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Produit non trouvé'
            });
        }
        
        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Mettre à jour le statut d'un produit
exports.updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!status || !['available', 'sold-out', 'discontinued'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Statut invalide'
            });
        }
        
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Produit non trouvé'
            });
        }
        
        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Recherche avancée de produits
exports.searchProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        // Construction de la requête de recherche avancée
        let searchQuery = {};
        
        if (req.body.keywords && req.body.keywords.trim() !== '') {
            searchQuery.$text = { $search: req.body.keywords };
        }
        
        if (req.body.categories && req.body.categories.length > 0) {
            searchQuery.category = { $in: req.body.categories };
        }
        
        if (req.body.brands && req.body.brands.length > 0) {
            searchQuery.brand = { $in: req.body.brands };
        }
        
        if (req.body.priceRange) {
            searchQuery.price = {};
            
            if (req.body.priceRange.min !== undefined) {
            searchQuery.price.$gte = req.body.priceRange.min;
            }
            
            if (req.body.priceRange.max !== undefined) {
            searchQuery.price.$lte = req.body.priceRange.max;
            }
        }
        
        if (req.body.isRentable !== undefined) {
            searchQuery.isRentable = req.body.isRentable;
        }
        
        if (req.body.inStock !== undefined && req.body.inStock) {
            searchQuery.stock = { $gt: 0 };
            searchQuery.status = 'available';
        }
    
        // Exécuter la recherche
        const products = await Product.find(searchQuery)
            .skip(skip)
            .limit(limit)
            .sort(req.body.sort || { createdAt: -1 });
    
        const total = await Product.countDocuments(searchQuery);
    
        res.status(200).json({
            success: true,
            count: products.length,
            total,
            data: products,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Récupérer les produits similaires
exports.getSimilarProducts = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Produit non trouvé'
            });
        }
        
        // Rechercher des produits similaires dans la même catégorie
        const similarProducts = await Product.find({
            _id: { $ne: product._id },
            category: product.category,
            status: 'available'
        })
        .limit(5)
        .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: similarProducts.length,
            data: similarProducts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};