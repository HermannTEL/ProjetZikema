// models/VideoCourse.js
const mongoose = require('mongoose');

const videoCourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instrument: [{ type: String }],
  level: { 
    type: String, 
    enum: ['Débutant', 'Intermédiaire', 'Avancé'],
    required: true 
  },
  type: { 
    type: String, 
    enum: ['recorded', 'live', 'webinar', 'masterclass'], 
    required: true 
  },
  format: { type: String, enum: ['video', 'audio'] },
  content: {
    videoUrl: String, // URL de la vidéo principale
    previewUrl: String, // URL d'un extrait/aperçu
    duration: Number, // en minutes
    chapters: [{ // Pour les vidéos plus longues avec chapitres
      title: String,
      startTime: Number, // en secondes
      description: String
    }]
  },
  liveSession: { // Pour les cours en direct
    date: Date,
    startTime: String,
    endTime: String,
    visioLink: String, // Zoom/Jitsi/etc.
    maxParticipants: Number,
    registeredParticipants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  price: { type: Number, default: 0 },
  isFree: { type: Boolean, default: false },
  thumbnail: String,
  attachments: [{ // Documents supplementaires
    title: String,
    type: { type: String, enum: ['pdf', 'audio', 'image', 'link'] },
    url: String,
    description: String
  }],
  tags: [String],
  categories: [String],
  requirements: [String], // Prérequis
  outcomes: [String], // Ce que l'élève va apprendre
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: Number,
    comment: String,
    date: { type: Date, default: Date.now }
  }],
  status: { 
    type: String, 
    enum: ['draft', 'published', 'archived'], 
    default: 'draft' 
  },
  createdAt: { type: Date, default: Date.now },
  publishedAt: Date
});

videoCourseSchema.index({ title: 'text', description: 'text', tags: 'text' });
videoCourseSchema.index({ instrument: 1, level: 1 });

module.exports = mongoose.model('VideoCourse', videoCourseSchema);