const express = require("express");
const router = express.Router();
const scheduleController = require("../Controllers/schedule.controller");
const {auth} = require("../Conf/Middlewares/auth");

// 📄 OPÉRATIONS SUR LES HORAIRES

// GET : Récupérer tous les horaires
router.get("/", scheduleController.getAllSchedules);

// GET : Récupérer un horaire par ID
router.get("/:id", scheduleController.getScheduleById);

// GET : Récupérer les horaires d'un étudiant par ID
router.get("/student/:studentId", scheduleController.getStudentSchedules);

router.get('/by-course/:courseId', scheduleController.getSchedulesByCourse);


// GET : Récupérer les horaires d'un professeur par ID
router.get("/professor/:professorId", scheduleController.getProfessorSchedules);

// GET : Vérifier la disponibilité d'un professeur par ID
router.get("/professor/availability/:id", scheduleController.getProfessorAvailability);


// POST : Créer des horaires récurrents pour un ID spécifique
router.post("/recurring/:id", scheduleController.createRecurringSchedules);

// POST : Marquer un horaire comme complété (accessible uniquement aux étudiants)
router.post("/completed/:id", auth(["student"]), scheduleController.markAsCompleted);

// POST : Marquer la présence d'un étudiant (accessible uniquement aux étudiants)
router.post("/attendance/:id", auth(["student"]), scheduleController.markAttendance);

// POST : Créer un nouvel horaire (accessible uniquement aux administrateurs et professeurs)
router.post("/", auth(["admin", "professor"]), scheduleController.createSchedule);

// POST : Réserver un horaire pour un étudiant (accessible uniquement aux étudiants)
router.post("/enroll/:id", auth(["student"]), scheduleController.enrollStudent);

// POST : Annuler l'inscription d'un étudiant à un horaire (accessible uniquement aux étudiants)
router.post("/unenroll/:id", auth(["student"]), scheduleController.unenrollStudent);


// PUT : Mettre à jour un horaire (pas d'ID spécifié, à définir selon les besoins)
router.put("/:id", scheduleController.updateSchedule);


// DELETE : Supprimer un horaire (pas d'ID spécifié, à définir selon les besoins)
router.delete("/:id", scheduleController.deleteSchedule);

module.exports = router;