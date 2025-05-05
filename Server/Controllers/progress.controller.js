// controllers/progressController.js
const Progress = require('../models/Progress');
const User = require('../Models/User');
const Course = require('../Models/Course');
const { sendNotification } = require('./notification.controller');

console.log('Progress controller loaded');

// Récupérer toutes les évaluations de progression
exports.getAllProgress = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        let query = {};
        
        // Filtres
        if (req.query.student) {
            query.student = req.query.student;
        }
        
        if (req.query.course) {
            query.course = req.query.course;
        }
        
        if (req.query.professor) {
            query.professor = req.query.professor;
        }
        
        const progressList = await Progress.find(query)
        .populate('student', 'firstName lastName email')
        .populate('professor', 'firstName lastName')
        .populate('course', 'title')
        .sort({ evaluationDate: -1 })
        .skip(skip)
        .limit(limit);
        
        const total = await Progress.countDocuments(query);
        
        res.status(200).json({
            success: true,
            count: progressList.length,
            total,
            data: progressList,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Récupérer les évaluations de progression d'un étudiant
exports.getStudentProgress = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        
        const progressList = await Progress.find({ student: studentId })
        .populate('professor', 'firstname lastname')
        .populate('course', 'title')
        .sort({ evaluationDate: -1 });

        // console.log(progressList);
        
        res.status(200).json({
            success: true,
            count: progressList.length,
            data: progressList
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Récupérer les évaluations de progression données par un professeur
exports.getProfessorEvaluations = async (req, res) => {
    try {
        const professorId = req.params.professorId;
        console.log("professorId", professorId);
        
        const progressList = await Progress.find({ professor: professorId })
            .populate('student', 'firstName lastName email')
            .populate('course', 'title')
            .sort({ evaluationDate: -1 });
        
        // console.log(
        //     "progressList",
        //     progressList
        // )
        res.status(200).json({
            success: true,
            count: progressList.length,
            data: progressList
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
  };
  
// Récupérer une évaluation par ID
exports.getProgressById = async (req, res) => {
    try {
        const progress = await Progress.findById(req.params.id)
            .populate('student', 'firstName lastName email')
            .populate('professor', 'firstName lastName')
            .populate('course', 'title')
            .populate('scheduleId');
        
        if (!progress) {
            return res.status(404).json({
                success: false,
                error: 'Évaluation non trouvée'
            });
        }
        
        res.status(200).json({
            success: true,
            data: progress
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
  
// Créer une nouvelle évaluation de progression
exports.createProgress = async (req, res) => {
    try {
        // Vérifier que l'étudiant et le cours existent
        const student = await User.findById(req.body.student);
        if (!student) {
            return res.status(404).json({
                success: false,
                error: 'Étudiant non trouvé'
            });
        }
        
        const course = await Course.findById(req.body.course);
        if (!course) {
            return res.status(404).json({
                success: false,
                error: 'Cours non trouvé'
            });
        }
        
        const newProgress = await Progress.create(req.body);
        
        // Calculer la note globale si elle n'est pas fournie
        if (!newProgress.evaluation.overall && Object.keys(newProgress.evaluation).length > 0) {
            const evaluationValues = Object.values(newProgress.evaluation).filter(v => typeof v === 'number');
            
            if (evaluationValues.length > 0) {
                const average = evaluationValues.reduce((a, b) => a + b, 0) / evaluationValues.length;
                newProgress.evaluation.overall = Math.round(average * 10) / 10; // Arrondir à 1 décimale
                await newProgress.save();
            }
        }
        
        // Notifier l'étudiant
        await sendNotification(
            req.body.student,
            'progress',
            'Nouvelle évaluation',
            `Une nouvelle évaluation a été ajoutée pour votre cours ${course.title}`,
            { progressId: newProgress._id, courseId: course._id }
        );
        
        res.status(201).json({
            success: true,
            data: newProgress
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
  
// Mettre à jour une évaluation
exports.updateProgress = async (req, res) => {
    try {
        const progress = await Progress.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!progress) {
            return res.status(404).json({
                success: false,
                error: 'Évaluation non trouvée'
            });
        }
        
        // Recalculer la note globale si des notes ont été modifiées
        if (req.body.evaluation) {
            const evaluationValues = Object.values(progress.evaluation).filter(v => typeof v === 'number' && v !== progress.evaluation.overall);
            
            if (evaluationValues.length > 0) {
                const average = evaluationValues.reduce((a, b) => a + b, 0) / evaluationValues.length;
                progress.evaluation.overall = Math.round(average * 10) / 10; // Arrondir à 1 décimale
                await progress.save();
            }
        }
        
        // Notifier l'étudiant
        const course = await Course.findById(progress.course);
        
        await sendNotification(
            progress.student,
            'progress',
            'Évaluation mise à jour',
            `Votre évaluation pour le cours ${course.title} a été mise à jour`,
            { progressId: progress._id, courseId: course._id }
        );
        
        res.status(200).json({
            success: true,
            data: progress
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
  
// Supprimer une évaluation
exports.deleteProgress = async (req, res) => {
    try {
        const progress = await Progress.findById(req.params.id);
        
        if (!progress) {
            return res.status(404).json({
                success: false,
                error: 'Évaluation non trouvée'
            });
        }
        
        // Récupérer les informations pour la notification
        const studentId = progress.student;
        const courseId = progress.course;
        
        const course = await Course.findById(courseId);
        
        await progress.deleteOne();
        
        // Notifier l'étudiant
        await sendNotification(
            studentId,
            'progress',
            'Évaluation supprimée',
            `Une évaluation pour le cours ${course.title} a été supprimée`,
            { courseId }
        );
        
        res.status(200).json({
            success: true,
            message: 'Évaluation supprimée avec succès'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Récupérer le progrès d'un étudiant pour un cours spécifique
exports.getStudentCourseProgress = async (req, res) => {
    try {
        const { studentId, courseId } = req.params;
        
        const progressList = await Progress.find({
            student: studentId,
            course: courseId
        })
            .populate('professor', 'firstName lastName')
            .sort({ evaluationDate: -1 });
        
        // Calculer des statistiques de progression
        let stats = {
            count: progressList.length,
            averageOverall: 0,
            improvement: 0,
            lastEvaluation: null
        };
        
        if (progressList.length > 0) {
            // Moyenne des évaluations globales
            stats.averageOverall = progressList.reduce((sum, item) => sum + (item.evaluation.overall || 0), 0) / progressList.length;
            
            // Comparer la première et la dernière évaluation pour voir l'amélioration
            if (progressList.length >= 2) {
                const firstEval = progressList[progressList.length - 1].evaluation.overall || 0;
                const lastEval = progressList[0].evaluation.overall || 0;
                stats.improvement = lastEval - firstEval;
            }
            
            // Dernière évaluation
            stats.lastEvaluation = progressList[0];
        }
        
        res.status(200).json({
            success: true,
            data: progressList,
            stats
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Ajouter un commentaire à une évaluation existante
exports.addFeedback = async (req, res) => {
    try {
        const progress = await Progress.findById(req.params.id);
        
        if (!progress) {
            return res.status(404).json({
                success: false,
                error: 'Évaluation non trouvée'
            });
        }
        
        const { feedback } = req.body;
        
        progress.feedback = feedback;
        await progress.save();
        
        // Notifier l'étudiant
        const course = await Course.findById(progress.course);
        
        await sendNotification(
            progress.student,
            'progress',
            'Nouveau commentaire sur votre progression',
            `Votre professeur a ajouté un commentaire à votre évaluation pour le cours ${course.title}`,
            { progressId: progress._id, courseId: course._id }
        );
        
        res.status(200).json({
            success: true,
            data: progress
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};