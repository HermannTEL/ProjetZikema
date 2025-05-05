// models/Enrollment.js
const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  schedules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Schedule' }],
  package: { // Si l'élève achète un package de cours
    type: { type: String, enum: ['single', 'package', 'subscription'] },
    quantity: { type: Number, default: 1 }, // Nombre de cours si package
    remainingSessions: { type: Number } // Pour suivre les sessions restantes
  },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'refunded'], 
    default: 'pending' 
  },
  paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
  enrolledAt: { type: Date, default: Date.now },
  startDate: Date,
  endDate: Date,
  notes: String
});

// Ajout d'index pour faciliter les recherches
enrollmentSchema.index({ student: 1, status: 1 });
enrollmentSchema.index({ course: 1, status: 1 });

module.exports = mongoose.model('Enrollment', enrollmentSchema);