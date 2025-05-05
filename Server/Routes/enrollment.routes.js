const express = require("express");
const router = express.Router();
const enrollmentController = require("../Controllers/enrollment.controller");

// ➕ OPÉRATIONS D'INSCRIPTION
// POST : Créer une nouvelle inscription
router.post("/", enrollmentController.createEnrollment);

// POST : Ajouter des horaires à une inscription
router.post("/add-schedules/:id", enrollmentController.addSchedules);


// 📄 OPÉRATIONS DE LECTURE
// GET : Récupérer toutes les inscriptions
router.get("/", enrollmentController.getAllEnrollments);

// GET : Récupérer une inscription unique par ID
router.get("/:id", enrollmentController.getEnrollmentById);

// GET : Récupérer les inscriptions d'un étudiant spécifique par ID
router.get("/student-enrollment/:studentId", enrollmentController.getStudentEnrollments);


// 📝 OPÉRATIONS DE MISE À JOUR
// PUT : Mettre à jour une inscription par ID
router.put("/:id", enrollmentController.updateEnrollment);

// PUT : Mettre à jour le nombre de sessions restantes pour une inscription par ID
router.put("/update-remaining-sessions/:id", enrollmentController.updateRemainingSessions);


// ❌ OPÉRATIONS DE SUPPRESSION
// DELETE : Supprimer une inscription par ID
router.delete("/:id", enrollmentController.deleteEnrollment);

module.exports = router;
