const express = require("express");
const router = express.Router();
const progressController = require('../Controllers/progress.controller');

// 📄 OPÉRATIONS SUR LE PROGRÈS

// GET : Récupérer tous les progrès
router.get("/", progressController.getAllProgress);

// GET : Récupérer le progrès par ID (général)
router.get("/progress/:id", progressController.getProgressById);

// GET : Récupérer le progrès d'un étudiant par ID
router.get("/student/:studentId", progressController.getStudentProgress);

// GET : Récupérer les évaluations d'un professeur par ID
router.get("/professor/evaluations/:professorId", progressController.getProfessorEvaluations);

// GET : Récupérer le progrès d'un étudiant dans un cours spécifique par ID
router.get("/student/:studentId/course/:courseId", progressController.getStudentCourseProgress);


// POST : Créer un nouveau progrès
router.post("/", progressController.createProgress);

// POST : Ajouter des retours (feedback)
router.post("/feedback", progressController.addFeedback);


// PUT : Mettre à jour un progrès par ID
router.put("/progress/:id", progressController.updateProgress);


// DELETE : Supprimer un progrès par ID
router.delete("/:id", progressController.deleteProgress);

module.exports = router;