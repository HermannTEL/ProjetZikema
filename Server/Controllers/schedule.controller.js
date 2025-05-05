// controllers/scheduleController.js
const Schedule = require('../Models/Schedule');
const Course = require('../Models/Course');
const User = require('../Models/User');
const { validationResult } = require('express-validator');
const notificationController = require('./notification.controller');

console.log('Schedule controller loaded');

// Récupérer tous les créneaux avec pagination et filtres
exports.getAllSchedules = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Construire les filtres
    const filter = {};
    
    if (req.query.course) {
      filter.course = req.query.course;
    }
    
    if (req.query.professor) {
      filter.professor = req.query.professor;
    }
    
    // Filtrer par date
    if (req.query.startDate || req.query.endDate) {
      filter.date = {};
      
      if (req.query.startDate) {
        filter.date.$gte = new Date(req.query.startDate);
      }
      
      if (req.query.endDate) {
        filter.date.$lte = new Date(req.query.endDate);
      }
    }
    
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    // Exécuter la requête
    const schedules = await Schedule.find(filter)
      .populate('course', 'title instrument level price')
      .populate('professor', 'firstname lastname profileImage')
      .populate('enrolledStudents.student', 'firstname lastname email profileImage')
      .sort({ date: 1, startTime: 1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Schedule.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      count: schedules.length,
      total,
      data: schedules,
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

// Récupérer un créneau par ID
exports.getScheduleById = async (req, res) => {
  const scheduleId = req.params.id;
  // console.log(`Schedule: ${scheduleId}`);
  try {
    const schedule = await Schedule.findById(scheduleId)
      .populate('course', 'title instrument level price description type capacity')
      .populate('professor', 'firstname lastname profileImage email phone')
      .populate('enrolledStudents.student', 'firstname lastname email profileImage phone');
    
    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Créneau non trouvé'
      });
    }
    
    // console.log(`Schedule: ${schedule}`);
    res.status(200).json({
      success: true,
      data: schedule
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getSchedulesByCourse = async (req, res) => {
  try {
      const { courseId } = req.params;
      console.log(courseId);

      const schedules = await Schedule.find({ course: courseId })
          .populate('professor', 'firstname lastname') // Juste les infos du prof
          .sort({ date: 1 }); // Tri chronologique

          console.log(schedules);

      res.status(200).json({
          success: true,
          count: schedules.length,
          data: schedules
      });
  } catch (error) {
      console.error("Erreur lors de la récupération des schedules :", error);
      res.status(500).json({ success: false, error: error.message });
  }
};

// Créer un nouveau créneau
exports.createSchedule = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Vérifier que le cours existe
    const course = await Course.findById(req.body.course);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Cours introuvable'
      });
    }
    
    // Vérifier que le professeur est bien celui du cours ou un admin
    if (req.user.role !== 'admin' && course.professor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'êtes pas autorisé à créer des créneaux pour ce cours'
      });
    }
    
    // Créer le créneau
    const scheduleData = {
      ...req.body,
      professor: course.professor,
      maxCapacity: course.capacity.max,
      currentCapacity: 0
    };
    
    const schedule = await Schedule.create(scheduleData);
    
    res.status(201).json({
      success: true,
      data: schedule
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Mettre à jour un créneau
exports.updateSchedule = async (req, res) => {
  try {
    // Vérifier que le créneau existe
    const schedule = await Schedule.findById(req.params.id);
    
    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Créneau non trouvé'
      });
    }
    
    // Vérifier que l'utilisateur a le droit de modifier le créneau
    if (req.user.role !== 'admin' && schedule.professor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'êtes pas autorisé à modifier ce créneau'
      });
    }
    
    // Si le statut change vers "cancelled", envoyer des notifications
    let notifyStudents = false;
    if (req.body.status === 'cancelled' && schedule.status !== 'cancelled') {
      notifyStudents = true;
    }
    
    // Mettre à jour le créneau
    const updatedSchedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('course', 'title');
    
    // Envoyer des notifications aux étudiants si nécessaire
    if (notifyStudents && updatedSchedule.enrolledStudents.length > 0) {
      const course = await Course.findById(updatedSchedule.course);
      
      for (const enrollment of updatedSchedule.enrolledStudents) {
        await notificationController.sendNotification(
          enrollment.student,
          'course_cancelled',
          'Cours annulé',
          `Votre cours de ${course.title} prévu le ${new Date(updatedSchedule.date).toLocaleDateString()} à ${updatedSchedule.startTime} a été annulé.`,
          {
            model: 'Schedule',
            id: updatedSchedule._id
          }
        );
      }
    }
    
    res.status(200).json({
      success: true,
      data: updatedSchedule
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Supprimer un créneau
exports.deleteSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    
    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Créneau non trouvé'
      });
    }
    
    // Vérifier que l'utilisateur a le droit de supprimer le créneau
    if (req.user.role !== 'admin' && schedule.professor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'êtes pas autorisé à supprimer ce créneau'
      });
    }
    
    // Vérifier s'il y a des étudiants inscrits
    if (schedule.enrolledStudents.length > 0) {
      // Notifier les étudiants de l'annulation
      const course = await Course.findById(schedule.course);
      
      for (const enrollment of schedule.enrolledStudents) {
        await notificationController.sendNotification(
          enrollment.student,
          'course_cancelled',
          'Cours supprimé',
          `Votre cours de ${course.title} prévu le ${new Date(schedule.date).toLocaleDateString()} à ${schedule.startTime} a été supprimé.`,
          null
        );
      }
    }
    
    await schedule.remove();
    
    res.status(200).json({
      success: true,
      message: 'Créneau supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Inscrire un étudiant à un créneau
exports.enrollStudent = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    
    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Créneau non trouvé'
      });
    }
    
    // Vérifier que le créneau n'est pas complet
    if (schedule.currentCapacity >= schedule.maxCapacity) {
      return res.status(400).json({
        success: false,
        message: 'Ce créneau est complet'
      });
    }
    
    // Vérifier que le créneau n'est pas annulé ou terminé
    if (schedule.status === 'cancelled' || schedule.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: `Ce créneau est ${schedule.status === 'cancelled' ? 'annulé' : 'terminé'}`
      });
    }
    
    // Vérifier que l'étudiant n'est pas déjà inscrit
    const studentId = req.body.studentId;
    const isAlreadyEnrolled = schedule.enrolledStudents.some(
      enrollment => enrollment.student.toString() === studentId
    );
    
    if (isAlreadyEnrolled) {
      return res.status(400).json({
        success: false,
        message: 'Cet étudiant est déjà inscrit à ce créneau'
      });
    }
    
    // Vérifier que l'utilisateur est un étudiant ou un admin
    const user = await User.findById(studentId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }
    
    if (user.role !== 'student' && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Seuls les étudiants peuvent s\'inscrire aux cours'
      });
    }
    
    // Inscrire l'étudiant
    schedule.enrolledStudents.push({
      student: studentId,
      enrollmentDate: new Date(),
      status: 'confirmed'
    });
    
    schedule.currentCapacity += 1;
    
    // Si le créneau est maintenant complet, mettre à jour le statut
    if (schedule.currentCapacity >= schedule.maxCapacity) {
      schedule.status = 'full';
    }
    
    await schedule.save();
    
    // Notifier le professeur
    const course = await Course.findById(schedule.course);
    await notificationController.sendNotification(
      schedule.professor,
      'student_enrolled',
      'Nouvel étudiant inscrit',
      `${user.firstname} ${user.lastname} s'est inscrit(e) à votre cours de ${course.title} du ${new Date(schedule.date).toLocaleDateString()}.`,
      {
        model: 'Schedule',
        id: schedule._id
      }
    );
    
    res.status(200).json({
      success: true,
      message: 'Inscription réussie',
      data: schedule
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Désinscrire un étudiant d'un créneau
exports.unenrollStudent = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    
    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Créneau non trouvé'
      });
    }
    
    // Vérifier que le créneau n'est pas terminé
    if (schedule.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Ce créneau est déjà terminé'
      });
    }
    
    // Identifier l'étudiant à désinscrire
    const studentId = req.body.studentId;
    
    // Vérifier que l'utilisateur a le droit de désinscrire cet étudiant
    if (req.user.role !== 'admin' && req.user.id !== studentId && req.user.id !== schedule.professor.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'êtes pas autorisé à désinscrire cet étudiant'
      });
    }
    
    // Trouver l'inscription de l'étudiant
    const enrollmentIndex = schedule.enrolledStudents.findIndex(
      enrollment => enrollment.student.toString() === studentId
    );
    
    if (enrollmentIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'Cet étudiant n\'est pas inscrit à ce créneau'
      });
    }
    
    // Supprimer l'inscription
    schedule.enrolledStudents.splice(enrollmentIndex, 1);
    schedule.currentCapacity -= 1;
    
    // Mettre à jour le statut si nécessaire
    if (schedule.status === 'full' && schedule.currentCapacity < schedule.maxCapacity) {
      schedule.status = 'available';
    }
    
    await schedule.save();
    
    // Notifier le professeur (sauf si c'est lui qui a désinscrit l'étudiant)
    if (req.user.id !== schedule.professor.toString()) {
      const student = await User.findById(studentId);
      const course = await Course.findById(schedule.course);
      
      await notificationController.sendNotification(
        schedule.professor,
        'student_unenrolled',
        'Désinscription d\'un étudiant',
        `${student.firstname} ${student.lastname} s'est désinscrit(e) de votre cours de ${course.title} du ${new Date(schedule.date).toLocaleDateString()}.`,
        {
          model: 'Schedule',
          id: schedule._id
        }
      );
    }
    
    res.status(200).json({
      success: true,
      message: 'Désinscription réussie',
      data: schedule
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Marquer un créneau comme terminé
exports.markAsCompleted = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    
    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Créneau non trouvé'
      });
    }
    
    // Vérifier que l'utilisateur est le professeur ou un admin
    if (req.user.role !== 'admin' && schedule.professor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'êtes pas autorisé à marquer ce créneau comme terminé'
      });
    }
    
    // Vérifier que le créneau n'est pas déjà terminé ou annulé
    if (schedule.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Ce créneau est déjà marqué comme terminé'
      });
    }
    
    if (schedule.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Ce créneau a été annulé'
      });
    }
    
    // Mettre à jour le statut
    schedule.status = 'completed';
    schedule.completedAt = new Date();
    
    // Marquer tous les étudiants comme présents par défaut
    for (const enrollment of schedule.enrolledStudents) {
      enrollment.attendance = enrollment.attendance || 'present';
    }
    
    await schedule.save();
    
    res.status(200).json({
      success: true,
      message: 'Créneau marqué comme terminé',
      data: schedule
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Marquer la présence d'un étudiant
exports.markAttendance = async (req, res) => {
  try {
    const { studentId, attendance } = req.body;
    
    if (!studentId || !attendance || !['present', 'absent', 'late', 'excused'].includes(attendance)) {
      return res.status(400).json({
        success: false,
        message: 'Données invalides'
      });
    }
    
    const schedule = await Schedule.findById(req.params.id);
    
    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Créneau non trouvé'
      });
    }
    
    // Vérifier que l'utilisateur est le professeur ou un admin
    if (req.user.role !== 'admin' && schedule.professor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'êtes pas autorisé à marquer les présences'
      });
    }
    
    // Trouver l'étudiant dans la liste des inscrits
    const enrollmentIndex = schedule.enrolledStudents.findIndex(
      enrollment => enrollment.student.toString() === studentId
    );
    
    if (enrollmentIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'Cet étudiant n\'est pas inscrit à ce créneau'
      });
    }
    
    // Mettre à jour la présence
    schedule.enrolledStudents[enrollmentIndex].attendance = attendance;
    await schedule.save();
    
    res.status(200).json({
      success: true,
      message: 'Présence mise à jour',
      data: schedule
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Récupérer les créneaux d'un professeur
exports.getProfessorSchedules = async (req, res) => {
  try {
    const professorId = req.params.professorId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // console.log(professorId);
    
    // Filtres
    const filter = { professor: professorId };
    
    // Filtrer par date
    if (req.query.startDate || req.query.endDate) {
      filter.date = {};
      
      if (req.query.startDate) {
        filter.date.$gte = new Date(req.query.startDate);
      }
      
      if (req.query.endDate) {
        filter.date.$lte = new Date(req.query.endDate);
      }
    } else {
      // Par défaut, afficher les créneaux à partir d'aujourd'hui
      filter.date = { $gte: new Date() };
    }
    
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    if (req.query.course) {
      filter.course = req.query.course;
    }
    
    const schedules = await Schedule.find(filter)
      .populate('course', 'title instrument level price')
      .populate('enrolledStudents.student', 'firstname lastname email profileImage')
      .sort({ date: 1, startTime: 1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Schedule.countDocuments(filter);
    
    // console.log(schedules);
    res.status(200).json({
      success: true,
      count: schedules.length,
      total,
      data: schedules,
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

// Récupérer les créneaux d'un étudiant
exports.getStudentSchedules = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // // Vérifier les permissions
    // if (req.user.role !== 'admin' && req.user.id !== studentId) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Accès non autorisé'
    //   });
    // }
    
    // Construire le filtre
    let filter = {
      'enrolledStudents.student': studentId
    };
    
    // Filtrer par date
    if (req.query.startDate || req.query.endDate) {
      filter.date = {};
      
      if (req.query.startDate) {
        filter.date.$gte = new Date(req.query.startDate);
      }
      
      if (req.query.endDate) {
        filter.date.$lte = new Date(req.query.endDate);
      }
    } else {
      // Par défaut, afficher les créneaux à partir d'aujourd'hui
      filter.date = { $gte: new Date() };
    }
    
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    if (req.query.course) {
      filter.course = req.query.course;
    }
    
    const schedules = await Schedule.find(filter)
      .populate('course', 'title instrument level price description')
      .populate('professor', 'firstname lastname profileImage email')
      .sort({ date: 1, startTime: 1 })
      .skip(skip)
      .limit(limit);

    // console.log(schedules);
    
    const total = await Schedule.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      count: schedules.length,
      total,
      data: schedules,
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

// Récupérer la disponibilité d'un professeur pour une période donnée
exports.getProfessorAvailability = async (req, res) => {
  try {
    const professorId = req.params.professorId;
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Les dates de début et de fin sont requises'
      });
    }
    
    // Vérifier que le professeur existe
    const professor = await User.findById(professorId);
    
    if (!professor || professor.role !== 'professor') {
      return res.status(404).json({
        success: false,
        message: 'Professeur non trouvé'
      });
    }
    
    // Récupérer tous les créneaux du professeur pour la période
    const schedules = await Schedule.find({
      professor: professorId,
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
      status: { $nin: ['cancelled'] }
    }).select('date startTime endTime');
    
    // Récupérer la disponibilité du professeur
    let defaultAvailability = professor.availability || [];
    
    // Construire la réponse
    const availability = {
      defaultAvailability,
      bookedSlots: schedules.map(schedule => ({
        date: schedule.date,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        scheduleId: schedule._id
      }))
    };
    
    res.status(200).json({
      success: true,
      data: availability
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Créer plusieurs créneaux en une seule fois (planification récurrente)
exports.createRecurringSchedules = async (req, res) => {
  try {
    const { courseId, recurringPattern, startDate, endDate, times, daysOfWeek } = req.body;
    
    if (!courseId || !recurringPattern || !startDate || !endDate || !times || !times.length || !daysOfWeek || !daysOfWeek.length) {
      return res.status(400).json({
        success: false,
        message: 'Données manquantes pour la création de créneaux récurrents'
      });
    }
    
    // Vérifier que le cours existe
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Cours introuvable'
      });
    }
    
    // Vérifier que l'utilisateur est le professeur du cours ou un admin
    if (req.user.role !== 'admin' && course.professor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'êtes pas autorisé à créer des créneaux pour ce cours'
      });
    }
    
    // Convertir les dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) {
      return res.status(400).json({
        success: false,
        message: 'La date de début doit être antérieure à la date de fin'
      });
    }
    
    // Générer tous les créneaux récurrents
    const schedulesToCreate = [];
    const currentDate = new Date(start);
    
    while (currentDate <= end) {
      // Vérifier si le jour de la semaine est inclus
      const dayOfWeek = currentDate.getDay(); // 0 = Dimanche, 1 = Lundi, ..., 6 = Samedi
      
      if (daysOfWeek.includes(dayOfWeek)) {
        for (const time of times) {
          // Extraire l'heure de début et de fin
          const [startTime, endTime] = time.split('-');
          
          if (!startTime || !endTime) {
            continue;
          }
          
          // Créer le créneau
          schedulesToCreate.push({
            course: courseId,
            professor: course.professor,
            date: new Date(currentDate),
            startTime,
            endTime,
            location: req.body.location,
            status: 'available',
            maxCapacity: course.capacity.max,
            currentCapacity: 0,
            notes: req.body.notes,
            enrolledStudents: []
          });
        }
      }
      
      // Passer au jour suivant
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    if (schedulesToCreate.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Aucun créneau à créer avec les paramètres fournis'
      });
    }
    
    // Créer tous les créneaux en une seule opération
    const createdSchedules = await Schedule.insertMany(schedulesToCreate);
    
    res.status(201).json({
      success: true,
      count: createdSchedules.length,
      message: `${createdSchedules.length} créneaux créés avec succès`,
      data: createdSchedules
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};