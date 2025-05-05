// controllers/courseController.js
const mongoose = require('mongoose');
const Course = require('../Models/Course');
const User = require('../Models/User');
const { validationResult } = require('express-validator');
const { removeExistingImage } = require('../Conf/Middlewares/multerConfig');

console.log('Course controller loaded');

// Récupérer tous les cours avec pagination et filtres
exports.getAllCourses = async (req, res) => {
  try {
    
    const courses = await Course.find()
    if (!courses) {
      return res.status(404).json({ message: 'Aucun cours trouvé', status: false });
    }
    // console.log(courses);
    res.status(200).json({data: courses, success: true});
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des cours'})
  }
}

// exports.getAllCourses = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;
    
//     // Construire les filtres
//     const filter = {};
    
//     if (req.query.instrument) {
//       filter.instrument = req.query.instrument;
//     }
    
//     if (req.query.level) {
//       filter.level = req.query.level;
//     }
    
//     if (req.query.type) {
//       filter.type = req.query.type;
//     }
    
//     if (req.query.professor) {
//       filter.professor = req.query.professor;
//     }
    
//     // Par défaut, afficher uniquement les cours actifs
//     if (!req.query.status) {
//       filter.status = 'active';
//     } else {
//       filter.status = req.query.status;
//     }
    
//     // Recherche par texte
//     if (req.query.search) {
//       filter.$or = [
//         { title: { $regex: req.query.search, $options: 'i' } },
//         { description: { $regex: req.query.search, $options: 'i' } }
//       ];
//     }
    
//     // Filtrage par prix
//     if (req.query.minPrice || req.query.maxPrice) {
//       filter.price = {};
      
//       if (req.query.minPrice) {
//         filter.price.$gte = parseInt(req.query.minPrice);
//       }
      
//       if (req.query.maxPrice) {
//         filter.price.$lte = parseInt(req.query.maxPrice);
//       }
//     }
    
//     // Tri
//     let sort = {};
//     if (req.query.sort) {
//       if (req.query.sort === 'price_asc') {
//         sort = { price: 1 };
//       } else if (req.query.sort === 'price_desc') {
//         sort = { price: -1 };
//       } else if (req.query.sort === 'newest') {
//         sort = { createdAt: -1 };
//       } else if (req.query.sort === 'title') {
//         sort = { title: 1 };
//       }
//     } else {
//       // Tri par défaut
//       sort = { createdAt: -1 };
//     }
    
//     // Exécuter la requête
//     const courses = await Course.find(filter)
//       .populate('professor', 'firstname lastname profileImage')
//       .sort(sort)
//       .skip(skip)
//       .limit(limit);
    
//     const total = await Course.countDocuments(filter);
    
//     res.status(200).json({
//       success: true,
//       count: courses.length,
//       total,
//       data: courses,
//       totalPages: Math.ceil(total / limit),
//       currentPage: page
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }
// };

// Récupérer un cours par ID
exports.getCourseById = async (req, res) => {
  try {
    const courseId = req.params.id;
    // console.log(courseId)

    // Validate the ObjectId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid course ID'
      });
    }

    const course = await Course.findById(courseId)
      .populate('professor', 'firstname lastname profileImage email bio instruments expertise hourlyRate');
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Cours non trouvé'
      });
    }
    
    // console.log(`Course: ${course}`);
    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Créer un nouveau cours
exports.createCourse = async (req, res) => {
  try {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const newCourse = new Course({
      ...req.body,
      imageUrl
    });

    const savedCourse = await newCourse.save();

    res.status(201).json({
      success: true,
      data: savedCourse
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création du cours",
      error: error.message
    });
  }
};

// Mettre à jour un cours
exports.updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ success: false, message: "Cours non trouvé" });
    }

    // Préparation des données à mettre à jour
    const updatedData = { ...req.body };

    // Gestion de l'image
    if (req.file) {
      // Si une nouvelle image est fournie, créer l'URL
      updatedData.imageUrl = `/uploads/${req.file.filename}`;
      
      // Supprimer l'ancienne image si elle existe
      if (course.imageUrl) {
        removeExistingImage(course.imageUrl);
      }
    } else if (req.body.imageUrl === undefined || req.body.imageUrl === null) {
      // Si imageUrl est explicitement null ou undefined dans la requête, garder l'ancienne valeur
      updatedData.imageUrl = course.imageUrl;
    }
    // Sinon, utiliser la valeur fournie dans req.body.imageUrl (peut être une chaîne vide pour supprimer)

    console.log(
      `Updated data for course ${courseId}:`, updatedData,
      `Old image: ${course.imageUrl}, New image: ${updatedData.imageUrl}`,
      `File: ${req.file ? req.file.filename : 'No file uploaded'}`
    );

    const updatedCourse = await Course.findByIdAndUpdate(courseId, updatedData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: updatedCourse
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour du cours",
      error: error.message
    });
  }
};

exports.uploadCourseImage = async (req, res) => {
  try {
    const courseId = req.params.id;
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: "Aucune image fournie" 
      });
    }
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ 
        success: false, 
        message: "Cours non trouvé" 
      });
    }
    
    // Construire l'URL de l'image
    const imageUrl = `/uploads/${req.file.filename}`;
    
    // Supprimer l'ancienne image si elle existe
    if (course.imageUrl) {
      removeExistingImage(course.imageUrl);
    }
    
    // Mettre à jour uniquement l'URL de l'image
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId, 
      { imageUrl }, 
      { new: true }
    );
    
    res.status(200).json({
      success: true,
      imageUrl,
      data: updatedCourse
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Erreur lors du téléchargement de l'image",
      error: error.message
    });
  }
};

// Supprimer un cours
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: "Cours non trouvé" });
    }

    // Supprimer l'image associée s'il y en a une
    if (course.imageUrl) {
      removeExistingImage(course.imageUrl);
    }

    await Course.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Cours supprimé avec succès"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression du cours",
      error: error.message
    });
  }
};

// Mettre à jour le statut d'un cours
exports.updateCourseStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['active', 'inactive', 'full', 'archived'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Statut invalide'
      });
    }
    
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Cours non trouvé'
      });
    }
    
    // Seul le professeur du cours ou un admin peut modifier le statut
    if (req.user.role !== 'admin' && course.professor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé - Vous n\'êtes pas l\'auteur de ce cours'
      });
    }
    
    course.status = status;
    await course.save();
    
    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Récupérer les cours par professeur
exports.getCoursesByProfessor = async (req, res) => {
  try {
    const professorId = req.params.professorId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Vérifier que le professeur existe
    const professor = await User.findById(professorId);
    
    if (!professor || professor.role !== 'professor') {
      return res.status(404).json({
        success: false,
        message: 'Professeur non trouvé'
      });
    }
    
    // Filtres
    const filter = { professor: professorId };
    
    if (req.query.status) {
      filter.status = req.query.status;
    } else {
      filter.status = 'active'; // Par défaut, cours actifs uniquement
    }
    
    const courses = await Course.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Course.countDocuments(filter);
    
    // console.log(
    //   `Courses retrieved for professor ${professorId} with status ${req.query.status} and page ${page} with ${limit} items per page`, courses
    // );
    res.status(200).json({
      success: true,
      count: courses.length,
      total,
      data: courses,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Récupérer les instruments disponibles pour les cours
exports.getAvailableInstruments = async (req, res) => {
  try {
    const instruments = await Course.distinct('instrument', { status: 'active' });
    
    res.status(200).json({
      success: true,
      count: instruments.length,
      data: instruments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Recherche avancée de cours
exports.searchCourses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Construction de la requête de recherche avancée
    let searchQuery = {};
    
    if (req.body.keywords && req.body.keywords.trim() !== '') {
      searchQuery.$or = [
        { title: { $regex: req.body.keywords, $options: 'i' } },
        { description: { $regex: req.body.keywords, $options: 'i' } }
      ];
    }
    
    if (req.body.instruments && req.body.instruments.length > 0) {
      searchQuery.instrument = { $in: req.body.instruments };
    }
    
    if (req.body.levels && req.body.levels.length > 0) {
      searchQuery.level = { $in: req.body.levels };
    }
    
    if (req.body.types && req.body.types.length > 0) {
      searchQuery.type = { $in: req.body.types };
    }
    
    if (req.body.priceRange) {
      searchQuery.price = {};
      
      if (req.body.priceRange.min !== undefined) {
        searchQuery.price.$gte = req.body.priceRange.min;
      }
      
      if (req.body.priceRange.max !== undefined) {
        searchQuery.price.$lte = req.body.priceRange.max;
      }
    }
    
    // Par défaut, rechercher uniquement parmi les cours actifs
    if (!req.body.includeInactive) {
      searchQuery.status = 'active';
    }
    
    // Exécuter la recherche
    const courses = await Course.find(searchQuery)
      .populate('professor', 'firstname lastname profileImage')
      .skip(skip)
      .limit(limit)
      .sort(req.body.sort || { createdAt: -1 });
    
    const total = await Course.countDocuments(searchQuery);
    
    res.status(200).json({
      success: true,
      count: courses.length,
      total,
      data: courses,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Récupérer les cours similaires
exports.getSimilarCourses = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Cours non trouvé'
      });
    }
    
    // Rechercher des cours similaires (même instrument et niveau)
    const similarCourses = await Course.find({
      _id: { $ne: course._id },
      instrument: course.instrument,
      level: course.level,
      status: 'active'
    })
    .limit(4)
    .populate('professor', 'firstname lastname profileImage');
    
    res.status(200).json({
      success: true,
      count: similarCourses.length,
      data: similarCourses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};