// controllers/cartController.js
const Cart = require('../Models/Cart');
const { sendNotification } = require('./notification.controller');

console.log('Cart controller loaded');

// Ajouter un élément au panier
exports.addItemToCart = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { itemType, itemId, quantity } = req.body;

        // console.log(userId, req.body)
        
        // Vérifier si le panier existe, sinon le créer
        let cart = await Cart.findOne({ user: userId });
        
        if (!cart) {
            cart = await Cart.create({
                user: userId,
                items: []
            });
        }
        
        // Vérifier si l'élément existe déjà dans le panier
        const itemIndex = cart.items.findIndex(
            item => item.itemType === itemType && item.itemId.toString() === itemId
        );
        
        if (itemIndex > -1) {
            // Mettre à jour la quantité si l'élément existe déjà
            cart.items[itemIndex].quantity += quantity || 1;
        } else {
            // Ajouter le nouvel élément
            cart.items.push({
                itemType,
                itemId,
                quantity: quantity || 1,
                addedAt: Date.now()
            });
        }
        
        cart.updatedAt = Date.now();
        await cart.save();
        
        // Envoyer une notification
        await sendNotification(
            userId,
            'cart',
            'Élément ajouté au panier',
            `Un ${itemType} a été ajouté à votre panier`,
            { itemType, itemId }
        );
        
        res.status(200).json({
            success: true,
            data: cart
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Créer un panier pour un utilisateur
exports.createCart = async (req, res) => {
    try {
        console.log(req);
        
        // Vérifier si l'utilisateur a déjà un panier
        const existingCart = await Cart.findOne({ user: req.body.userId });
        
        if (existingCart) {
            return res.status(400).json({
                success: false,
                error: 'L\'utilisateur possède déjà un panier'
            });
        }
        
        const newCart = await Cart.create(req.body);
        
        res.status(201).json({
            success: true,
            data: newCart
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
    }
};

// Récupérer le panier d'un utilisateur
exports.getUserCart = async (req, res) => {
    try {
        const userId = req.params.userId;

        console.log(userId);
        const cart = await Cart.findOne({ user: userId })
        .populate({
            path: 'items.itemId',
            refPath: 'items.itemType'
        });
        
        if (!cart) {
            return res.status(404).json({
                success: false,
                error: 'Panier non trouvé'
            });
        }
        
        console.log(cart);
        res.status(200).json({
            success: true,
            data: cart
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Compter les éléments dans le panier
exports.countCartItems = async (req, res) => {
    try {
        const userId = req.params.userId;
        
        const cart = await Cart.findOne({ user: userId });
        
        if (!cart) {
            return res.status(200).json({
                success: true,
                count: 0
            });
        }
        
        const itemCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);
        
        res.status(200).json({
            success: true,
            count: itemCount
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Mettre à jour la quantité d'un élément dans le panier
exports.updateCartItem = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { itemType, itemId, quantity } = req.body;
        
        const cart = await Cart.findOne({ user: userId });
        
        if (!cart) {
            return res.status(404).json({
                success: false,
                error: 'Panier non trouvé'
            });
        }
        
        const itemIndex = cart.items.findIndex(
            item => item.itemType === itemType && item.itemId.toString() === itemId
        );
        
        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Élément non trouvé dans le panier'
            });
        }
        
        // Mettre à jour la quantité
        cart.items[itemIndex].quantity = quantity;
        cart.updatedAt = Date.now();
        
        await cart.save();
        
        res.status(200).json({
            success: true,
            data: cart
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Supprimer un élément du panier
exports.removeCartItem = async (req, res) => {
    try {
        const { itemType, itemId, userId } = req.params;
        
        const cart = await Cart.findOne({ user: userId });
        
        if (!cart) {
            return res.status(404).json({
                success: false,
                error: 'Panier non trouvé'
            });
        }
        
        // Filtrer pour supprimer l'élément
        cart.items = cart.items.filter(
            item => !(item.itemType === itemType && item.itemId.toString() === itemId)
        );
        
        cart.updatedAt = Date.now();
        await cart.save();
        
        res.status(200).json({
            success: true,
            data: cart
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Vider le panier
exports.clearCart = async (req, res) => {
    try {
        const userId = req.params.userId;
        
        const cart = await Cart.findOne({ user: userId });
        
        if (!cart) {
            return res.status(404).json({
                success: false,
                error: 'Panier non trouvé'
            });
        }
        
        cart.items = [];
        cart.updatedAt = Date.now();
        await cart.save();
        
        await sendNotification(
            userId,
            'cart',
            'Panier vidé',
            'Votre panier a été vidé avec succès',
            null
        );
        
        res.status(200).json({
            success: true,
            message: 'Panier vidé avec succès'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
};
