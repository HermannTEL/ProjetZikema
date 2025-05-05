// models/Payment.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  stripeSessionId: { type: String, required: true },
  stripeCustomerId: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  email: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'CAD' },
  type: { 
    type: String, 
    enum: ['course', 'product', 'subscription', 'package'], 
    required: true 
  },
  items: [{
    itemType: { type: String, enum: ['Course', 'product'] },
    itemId: { type: mongoose.Schema.Types.ObjectId, refPath: 'items.itemType' },
    quantity: { type: Number, default: 1 },
    price: Number
  }],
  status: { 
    type: String, 
    enum: ['pending', 'succeeded', 'failed', 'refunded', 'partially_refunded'], 
    default: 'pending' 
  },
  invoiceNumber: String,
  invoiceUrl: String,
  receiptUrl: String,
  refundId: String,
  refundAmount: Number,
  refundReason: String,
  metadata: Object, // Pour stocker des données supplémentaires
  paymentMethod: {
    type: { type: String, enum: ['card', 'bank_transfer', 'other'] },
    last4: String,
    brand: String
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);