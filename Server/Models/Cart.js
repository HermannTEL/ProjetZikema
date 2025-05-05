// models/Cart.js
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    itemType: { type: String, enum: ['Course', 'Product', 'VideoCourse'] },
    itemId: { type: mongoose.Schema.Types.ObjectId, refPath: 'items.itemType' },
    quantity: { type: Number, default: 1 },
    addedAt: { type: Date, default: Date.now }
  }],
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cart', cartSchema);