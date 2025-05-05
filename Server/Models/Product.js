// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  images: [String], // Multiple images
  mainImage: String,
  category: { 
    type: String, 
    enum: ['Piano', 'Guitare', 'Chant', 'Batterie', 'Accessoire', 'Livre', 'Partition', 'Autre'],
    required: true 
  },
  subcategory: String,
  stock: { type: Number, default: 0 },
  isRentable: { type: Boolean, default: false },
  rentalPrice: {
    daily: Number,
    weekly: Number,
    monthly: Number
  },
  brand: String,
  condition: { type: String, enum: ['new', 'excellent', 'good', 'fair', 'poor'] },
  weight: Number, // en kg, pour le calcul des frais de livraison
  dimensions: {
    height: Number,
    width: Number,
    depth: Number
  },
  features: [String],
  tags: [String],
  status: { type: String, enum: ['available', 'sold-out', 'discontinued'], default: 'available' },
  createdAt: { type: Date, default: Date.now }
});

// Ajout d'index pour la recherche
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, subcategory: 1 });

module.exports = mongoose.model('Product', productSchema);