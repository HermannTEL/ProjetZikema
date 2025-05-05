// models/Progress.js
const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  professor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  evaluation: {
    technique: { type: Number, min: 0, max: 10 },
    theory: { type: Number, min: 0, max: 10 },
    musicality: { type: Number, min: 0, max: 10 },
    engagement: { type: Number, min: 0, max: 10 },
    overall: { type: Number, min: 0, max: 10 }
  },
  notes: String,
  feedback: String, // Commentaires détaillés
  strengths: [String],
  areasToImprove: [String],
  recommendedExercises: [String],
  nextGoals: [String],
  evaluationDate: { type: Date, default: Date.now },
  scheduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Schedule' } // Lien avec la session spécifique
});

module.exports = mongoose.model('Progress', progressSchema);