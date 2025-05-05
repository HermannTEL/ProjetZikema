// controllers/userController.js
const User = require('../Models/User');
const Course = require('../Models/Course');
const Enrollment = require('../Models/Enrollment');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

console.log('User controller loaded');

// Récupérer le profil de l'utilisateur connecté
exports.getMe = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log('User ID:', userId);

    // Vérifier si l'utilisateur existe
    const user = await User.findById(userId).select('-password -resetPasswordToken -resetPasswordExpires');
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Vérifier si l'utilisateur est actif
    if (!user.isActive) {
      console.log('User is not active');
      return res.status(403).json({ message: 'User is not active' });
    }
    
    console.log('User data:', userData);
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Mettre à jour le profil utilisateur
exports.updateProfile = async (req, res) => {
  try {
    // Champs à ne pas modifier directement
    const protectedFields = ['password', 'role', 'isActive', 'resetPasswordToken', 'resetPasswordExpires'];
    
    // Filtrer les champs protégés
    const updateData = {};
    for (const key in req.body) {
      if (!protectedFields.includes(key)) {
        updateData[key] = req.body[key];
      }
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Modifier le mot de passe
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Vérifier si les mots de passe sont fournis
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez fournir le mot de passe actuel et le nouveau mot de passe'
      });
    }

    // Récupérer l'utilisateur avec son mot de passe
    const user = await User.findById(req.params.id).select('+password');

    // Vérifier si le mot de passe actuel est correct
    const isMatch = await user.verifyPassword(currentPassword);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Mot de passe actuel incorrect'
      });
    }

    // Mettre à jour le mot de passe
    user.password = newPassword;
    await user.save();

    // Générer un nouveau token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });

    res.status(200).json({
      success: true,
      message: 'Mot de passe mis à jour avec succès',
      token
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Demander la réinitialisation du mot de passe
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
          return res.status(400).json({
              success: false,
              message: 'Veuillez fournir votre adresse email'
          });
        }

        const user = await User.findOne({ email });

        if (!user) {
          return res.status(404).json({
              success: false,
              message: 'Aucun utilisateur trouvé avec cette adresse email'
          });
        }

        // Générer un token de réinitialisation
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Hasher le token et définir une date d'expiration
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        await user.save({ validateBeforeSave: false });

        // Envoyer un email avec le lien de réinitialisation
        // const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
        // await emailService.sendPasswordResetEmail(user.email, resetUrl);

        res.status(200).json({
        success: true,
        message: 'Email de réinitialisation envoyé'
        });
    } catch (error) {
        // En cas d'erreur, réinitialiser les champs de réinitialisation
        const user = await User.findOne({ email: req.body.email });
        
        if (user) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save({ validateBeforeSave: false });
        }

        console.error(error);
        res.status(500).json({
        success: false,
        error: error.message
        });
    }
};

// Réinitialiser le mot de passe
exports.resetPassword = async (req, res) => {
  try {
    // Récupérer le token de la requête et le hacher
    const { token } = req.params;
    const { password } = req.body;
    
    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

    // Rechercher l'utilisateur avec ce token et vérifier qu'il n'a pas expiré
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token invalide ou expiré'
      });
    }

    // Réinitialiser le mot de passe
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    await user.save();

    // Générer un nouveau token JWT
    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });

    res.status(200).json({
      success: true,
      message: 'Mot de passe réinitialisé avec succès',
      token: jwtToken
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (!users) {
      console.log("Users: ", users);
      return res.status(400).json({ data: null, success: false});
    }

    console.log("Users: ", users.length);
    
    return res.status(200).json({ data: users, success: true});
  } catch (error) {
    console.log(" Errors: ", error);
    return res.status(500).json({ data: null, success: false});
  }
}

// // Récupérer tous les utilisateurs (pour admin)
// exports.getAllUsers = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;
    
//     // Filtres de recherche
//     const filter = {};
    
//     if (req.query.role) {
//     filter.role = req.query.role;
//     }
    
//     if (req.query.search) {
//     filter.$or = [
//         { firstname: { $regex: req.query.search, $options: 'i' } },
//         { lastname: { $regex: req.query.search, $options: 'i' } },
//         { email: { $regex: req.query.search, $options: 'i' } }
//     ];
//     }
    
//     // Exécuter la requête
//     const users = await User.find(filter)
//     .select('-password')
//     .skip(skip)
//     .limit(limit)
//     .sort({ createdAt: -1 });
    
//     const total = await User.countDocuments(filter);
    
//     res.status(200).json({
//       success: true,
//       count: users.length,
//       total,
//       data: users,
//       totalPages: Math.ceil(total / limit),
//       currentPage: page
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//     success: false,
//     error: error.message
//     });
//   }
// };

// Récupérer un utilisateur par ID (pour admin)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    console.log(user);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Mettre à jour un utilisateur (pour admin)
exports.updateUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;
    const userId = req.params.id;

    // Image Handling
    const imageUrl = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : undefined;
    if (imageUrl) req.body.imageUrl = imageUrl;

    // Vérifier si l'utilisateur existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
    }

    // Vérifier si l'email est déjà utilisé par un autre
    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(400).json({
          success: false,
          message: "Cet email est déjà utilisé par un autre utilisateur"
        });
      }
    }

    // Mettre à jour l'utilisateur
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      req.body,
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      data: updatedUser
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Erreur interne", error: error.message });
  }
};

// Activer/Désactiver un utilisateur (pour admin)
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }
    
    user.isActive = !user.isActive;
    await user.save();
    
    res.status(200).json({
      success: true,
      data: user,
      message: `L'utilisateur a été ${user.isActive ? 'activé' : 'désactivé'}`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Récupérer tous les professeurs
exports.getAllProfessors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Filtres de recherche
    const filter = { role: 'professor', isActive: true };
    
    if (req.query.instrument) {
      filter.instruments = req.query.instrument;
    }
    
    if (req.query.expertise) {
      filter.expertise = req.query.expertise;
    }
    
    if (req.query.search) {
      filter.$or = [
        { firstname: { $regex: req.query.search, $options: 'i' } },
        { lastname: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    // Exécuter la requête
    const professors = await User.find(filter)
      .select('-password -resetPasswordToken -resetPasswordExpires')
      .skip(skip)
      .limit(limit)
      .sort({ lastname: 1 });
    
    const total = await User.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      count: professors.length,
      total,
      data: professors,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Mettre à jour les disponibilités d'un professeur
exports.updateAvailability = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }
    
    if (user.role !== 'professor') {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé - Réservé aux professeurs'
      });
    }
    
    user.availability = req.body.availability;
    await user.save();
    
    res.status(200).json({
      success: true,
      data: user,
      message: 'Disponibilités mises à jour avec succès'
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Mettre à jour les préférences de notification
exports.updateNotificationPreferences = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }
    
    user.notificationPreferences = {
      ...user.notificationPreferences,
      ...req.body
    };
    
    await user.save();
    
    res.status(200).json({
      success: true,
      data: user.notificationPreferences,
      message: 'Préférences de notification mises à jour avec succès'
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

exports.getProfStudents = async (req, res) => {
  try {
    const professorId = req.params.professorId;

    // 1. Récupérer tous les cours donnés par ce professeur
    const courses = await Course.find({ professor: professorId }).select('_id');
    const courseIds = courses.map(course => course._id);

    // 2. Récupérer toutes les inscriptions à ces cours
    const enrollments = await Enrollment.find({ course: { $in: courseIds } })
      .populate('student', 'firstname lastname email level preferredInstruments')
      .exec();

    // 3. Extraire les étudiants uniques (éviter les doublons)
    const studentsMap = new Map();
    enrollments.forEach(enrollment => {
      const student = enrollment.student;
      if (student && !studentsMap.has(student._id.toString())) {
        studentsMap.set(student._id.toString(), student);
      }
    });

    const uniqueStudents = Array.from(studentsMap.values());

    res.status(200).json({ success: true, data: uniqueStudents });
  } catch (error) {
    console.error('Erreur dans getProfStudents:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }

    await user.remove();

    res.status(200).json({
      success: true, 
      message: 'Utilisateur supprimé avec succès' 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
}