// models/Center.js
const mongoose = require('mongoose');

const centerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, default: 'France' }
  },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number] // [longitude, latitude]
  },
  contact: {
    phone: String,
    email: String,
    website: String
  },
  description: String,
  images: [String],
  mainImage: String,
  openingHours: [{
    day: { type: String, enum: ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'] },
    open: Boolean,
    hours: [{
      start: String,
      end: String
    }]
  }],
  facilities: [{ type: String, enum: ['parking', 'wifi', 'cafe', 'handicap access'] }],
  rooms: [{
    name: String,
    capacity: Number,
    equipment: [String],
    type: { type: String, enum: ['studio', 'classroom', 'practice room', 'concert hall'] }
  }],
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['active', 'inactive', 'under maintenance'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

centerSchema.index({ location: '2dsphere' });
centerSchema.index({ 'address.city': 1 });

module.exports = mongoose.model('Center', centerSchema);