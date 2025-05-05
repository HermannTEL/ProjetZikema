const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Pour le hachage du mot de passe

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  confirmPassword: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'manager', 'professor', 'student'],
    default: 'student'
  },
  phone: String,
  profileImage: String,
  bio: String,
  address: {
    street: String,
    city: String,
    postalCode: String,
    country: { type: String, default: 'France' }
  },
  // Champs spécifiques aux professeurs
  instruments: [String],
  expertise: [String], // ex: ['jazz', 'classique', 'pop']
  availability: [{
    day: { type: String, enum: ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'] },
    startTime: String,
    endTime: String
  }],
  hourlyRate: Number,
  
  // Champs spécifiques aux élèves
  studentType: { 
    type: String, 
    enum: ['regular', 'occasional', 'online-only'], 
    default: 'regular' 
  },
  preferredInstruments: [String],
  level: { type: String, enum: ['Débutant', 'Intermédiaire', 'Avancé'] },
  
  // Préférences
  notificationPreferences: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
    reminder: { type: Number, default: 24 } // Rappel en heures avant le cours
  },
  
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, { timestamps: true });

// // Middleware pour hacher le mot de passe avant de sauvegarder l'utilisateur
// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next(); // Ne pas hacher si le mot de passe n'est pas modifié
//   const salt = await bcrypt.genSalt(10); // Générer un sel
//   this.password = await bcrypt.hash(this.password, salt); // Hacher le mot de passe
//   next(); // Passer au middleware suivant
// });

// Méthode pour comparer le mot de passe
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password); // Comparer le mot de passe candidat avec le mot de passe haché
};

module.exports = mongoose.model('User', userSchema);