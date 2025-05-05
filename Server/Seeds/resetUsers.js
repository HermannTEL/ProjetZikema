// resetUsers.js

const mongoose = require('mongoose');
const User = require('../Models/User');
require('dotenv').config();

// Connexion à ta base MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connexion à MongoDB réussie');
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error.message);
    process.exit(1);
  }
}

// Fonction pour supprimer tous les utilisateurs
async function resetUsers() {
  try {
    await connectDB();

    const result = await User.deleteMany({});
    console.log(`🗑️ ${result.deletedCount} utilisateurs supprimés.`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la suppression:', error.message);
    process.exit(1);
  }
}

resetUsers();
