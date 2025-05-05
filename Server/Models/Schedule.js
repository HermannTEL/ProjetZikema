// models/Schedule.js
const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  professor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  currentCapacity: { type: Number, default: 0 },
  maxCapacity: { type: Number, default: 1 },
  enrolledStudents: [{ 
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    enrollmentDate: { type: Date, default: Date.now },
    attendance: { type: String, enum: ['pending', 'present', 'absent', 'excused'], default: 'pending' },
    feedback: String
  }],
  status: { 
    type: String, 
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled'], 
    default: 'scheduled' 
  },
  notes: String, // Notes du professeur pour la séance
  resources: [{ // Documents/ressources pour le cours
    title: String,
    type: { type: String, enum: ['pdf', 'audio', 'video', 'link'] },
    url: String
  }],
  roomNumber: String, // Pour les cours en centre
  videoLink: String, // Pour les cours en ligne
  isMakeup: { type: Boolean, default: false } // Session de rattrapage
}, { timestamps: true });

// Amélioration de la recherche de créneaux disponibles
scheduleSchema.index({ date: 1, professor: 1 });
scheduleSchema.index({ course: 1, date: 1 });

module.exports = mongoose.model('Schedule', scheduleSchema);