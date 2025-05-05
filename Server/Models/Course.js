// models/Course.js
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instrument: { type: String, required: true },
  level: { 
    type: String, 
    enum: ['Enfant', 'Débutant', 'Intermédiaire', 'Avancé', 'Tous'],
    required: true 
  },
  professor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['individual', 'group', 'workshop', 'masterclass'],
    default: 'individual' 
  },
  capacity: { // Pour les cours en groupe
    min: { type: Number, default: 1 },
    max: { type: Number, default: 1 }
  },
  price: { type: Number, required: true },
  duration: { type: Number, required: true }, // en minutes
  center: { type: mongoose.Schema.Types.ObjectId, ref: 'Center' },
  location: { // Possibilité de cours hors centre (domicile, en ligne...)
    type: { type: String, enum: ['center', 'home', 'online'] },
    address: String
  },
  imageUrl: String,
  videoPreview: String,
  syllabus: String, // Description détaillée du programme
  tags: [String], // Pour faciliter la recherche
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'full', 'archived'],
    default: 'active' 
  },
  recurring: { // Pour les cours récurrents
    isRecurring: { type: Boolean, default: false },
    frequency: { type: String, enum: ['weekly', 'biweekly', 'monthly'] },
    endDate: Date
  }
}, { timestamps: true });

// Amélioration de la recherche
courseSchema.index({ instrument: 1, level: 1, tags: 1 });
courseSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Course', courseSchema);