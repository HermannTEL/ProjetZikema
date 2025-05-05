// controllers/enrollmentController.js
const Enrollment = require('../Models/Enrollment');
const Course = require('../Models/Course');
const User = require('../Models/User');
const { sendNotification } = require('./notification.controller');

console.log('Enrollment controller loaded');

// Récupérer toutes les inscriptions
exports.getAllEnrollments = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        let query = {};
        
        // Filtres
        if (req.query.status) {
            query.status = req.query.status;
        }
        
        if (req.query.course) {
            query.course = req.query.course;
        }
        
        if (req.query.student) {
            query.student = req.query.student;
        }
        
        const enrollments = await Enrollment.find(query)
        .populate('student', 'firstName lastName email')
        .populate('course', 'title')
        .populate('schedules')
        .sort({ enrolledAt: -1 })
        .skip(skip)
        .limit(limit);
        
        const total = await Enrollment.countDocuments(query);
        
        res.status(200).json({
            success: true,
            count: enrollments.length,
            total,
            data: enrollments,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Récupérer les inscriptions d'un étudiant
exports.getStudentEnrollments = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const statusQuery = req.query.status; // Peut être undefined

        let statusFilter = {};

        if (statusQuery) {
            // Si un statut est précisé dans l'URL (ex: status=confirmed)
            statusFilter.status = statusQuery;
        } else {
            // Sinon, par défaut on veut confirmed ET pending
            statusFilter.status = { $in: ['confirmed', 'pending'] };
        }

        const enrollments = await Enrollment.find({ 
            student: studentId,
            ...statusFilter
        })
        .populate('course')
        .populate('schedules')
        .sort({ enrolledAt: -1 });

        res.status(200).json({
            success: true,
            count: enrollments.length,
            data: enrollments
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


// Récupérer une inscription par ID
exports.getEnrollmentById = async (req, res) => {
    try {
        const enrollment = await Enrollment.findById(req.params.id)
        .populate('student', 'firstName lastName email')
        .populate('course')
        .populate('schedules')
        .populate('paymentId');
        
        if (!enrollment) {
            return res.status(404).json({
                success: false,
                error: 'Inscription non trouvée'
            });
        }
        
        res.status(200).json({
            success: true,
            data: enrollment
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Créer une nouvelle inscription
exports.createEnrollment = async (req, res) => {
    try {
        // Vérifier si l'étudiant est déjà inscrit au cours
        const existingEnrollment = await Enrollment.findOne({
            student: req.body.student,
            course: req.body.course,
            status: { $in: ['pending', 'confirmed'] }
        });

        console.log('Existing enrollment:', existingEnrollment, "Student ID:", req.body.student, "Course ID:", req.body.course);
        
        if (existingEnrollment) {
            return res.status(400).json({
                success: false,
                error: 'L\'étudiant est déjà inscrit à ce cours'
            });
        }
        
        // Récupérer les informations du cours pour les notifications
        const course = await Course.findById(req.body.course);
        if (!course) {
            return res.status(404).json({
                success: false,
                error: 'Cours non trouvé'
            });
        }
        
        const newEnrollment = await Enrollment.create(req.body);
        
        // Notifier l'étudiant
        await sendNotification(
            req.body.student,
            'enrollment',
            'Nouvelle inscription',
            `Vous êtes inscrit au cours ${course.title}. Statut: ${newEnrollment.status}`,
            { enrollmentId: newEnrollment._id }
        );
        
        // Notifier le professeur si disponible
        if (course.teacher) {
            await sendNotification(
                course.teacher,
                'enrollment',
                'Nouvelle inscription au cours',
                `Un nouvel étudiant s'est inscrit à votre cours ${course.title}`,
                { enrollmentId: newEnrollment._id, courseId: course._id }
            );
        }
        
        res.status(201).json({
            success: true,
            data: newEnrollment
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Mettre à jour une inscription
exports.updateEnrollment = async (req, res) => {
    try {
        const enrollment = await Enrollment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!enrollment) {
            return res.status(404).json({
                success: false,
                error: 'Inscription non trouvée'
            });
        }
        
        // Récupérer les informations du cours pour les notifications
        const course = await Course.findById(enrollment.course);
        
        // Notifier l'étudiant si le statut a changé
        if (req.body.status) {
            await sendNotification(
                enrollment.student,
                'enrollment',
                'Mise à jour de l\'inscription',
                `Le statut de votre inscription au cours ${course.title} a été changé à ${req.body.status}`,
                { enrollmentId: enrollment._id }
            );
        }
        
        res.status(200).json({
            success: true,
            data: enrollment
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Supprimer une inscription
exports.deleteEnrollment = async (req, res) => {
    try {
        const enrollment = await Enrollment.findById(req.params.id);
        
        if (!enrollment) {
            return res.status(404).json({
                success: false,
                error: 'Inscription non trouvée'
            });
        }
        
        // Récupérer les informations pour les notifications
        const student = enrollment.student;
        const course = await Course.findById(enrollment.course);
        
        await enrollment.deleteOne();
        
        // Notifier l'étudiant
        await sendNotification(
            student,
            'enrollment',
            'Inscription annulée',
            `Votre inscription au cours ${course.title} a été annulée`,
            { courseId: course._id }
        );
        
        // Notifier le professeur si disponible
        if (course.teacher) {
            await sendNotification(
                course.teacher,
                'enrollment',
                'Inscription annulée',
                `Une inscription a été annulée pour votre cours ${course.title}`,
                { courseId: course._id }
            );
        }
        
        res.status(200).json({
            success: true,
            message: 'Inscription supprimée avec succès'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Mettre à jour le nombre de sessions restantes
exports.updateRemainingSessions = async (req, res) => {
    try {
        const enrollment = await Enrollment.findById(req.params.id);
        
        if (!enrollment) {
            return res.status(404).json({
                success: false,
                error: 'Inscription non trouvée'
            });
        }
        
        // Vérifier si l'inscription a un package
        if (!enrollment.package || enrollment.package.type !== 'package') {
            return res.status(400).json({
                success: false,
                error: 'Cette inscription n\'est pas un package avec des sessions comptabilisées'
            });
        }
        
        const { remainingSessions } = req.body;
        enrollment.package.remainingSessions = remainingSessions;
        
        await enrollment.save();
        
        // Notifier l'étudiant si les sessions sont basses
        if (remainingSessions <= 3 && remainingSessions > 0) {
            const course = await Course.findById(enrollment.course);
            
            await sendNotification(
                enrollment.student,
                'enrollment',
                'Sessions restantes',
                `Il ne vous reste que ${remainingSessions} sessions pour le cours ${course.title}`,
                { enrollmentId: enrollment._id }
            );
        }
        
        res.status(200).json({
            success: true,
            data: enrollment
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Ajouter des horaires à une inscription
exports.addSchedules = async (req, res) => {
    try {
        const enrollment = await Enrollment.findById(req.params.id);
        
        if (!enrollment) {
            return res.status(404).json({
                success: false,
                error: 'Inscription non trouvée'
            });
        }
        
        const { schedules } = req.body;
        
        // Ajouter les nouveaux horaires sans doublons
        if (Array.isArray(schedules)) {
            schedules.forEach(scheduleId => {
                if (!enrollment.schedules.includes(scheduleId)) {
                enrollment.schedules.push(scheduleId);
                }
            });
        }
        
        await enrollment.save();
        
        // Notifier l'étudiant
        const course = await Course.findById(enrollment.course);
        
        await sendNotification(
            enrollment.student,
            'enrollment',
            'Horaires mis à jour',
            `Des horaires ont été ajoutés à votre inscription au cours ${course.title}`,
            { enrollmentId: enrollment._id }
        );
        
        res.status(200).json({
            success: true,
            data: enrollment
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};