const express = require("express");
const router = express.Router();
const courseController = require("../Controllers/course.controller");
const {auth} = require("../Conf/Middlewares/auth");
const { upload, handleMulterErrors } = require("../Conf/Middlewares/multerConfig");

// CRÉER : ➕ Créer un nouveau cours (accessible uniquement aux administrateurs et professeurs)
router.post("/", auth(["admin", "professor"]), upload.single('imageUrl'), handleMulterErrors, courseController.createCourse);
router.post("/:id/upload-image", auth(["admin", "professor"]), upload.single('imageUrl'), handleMulterErrors, courseController.uploadCourseImage);

// RECHERCHER : Rechercher des cours
router.post("/search-course", courseController.searchCourses);


// 📄 OPÉRATIONS DE LECTURE
// GET : Récupérer tous les cours
router.get("/", courseController.getAllCourses);

// GET : Récupérer un cours unique par ID
router.get("/:id", courseController.getCourseById);

// GET : Récupérer les cours d'un professeur spécifique
router.get("/courses-by-professor/:professorId", courseController.getCoursesByProfessor);

// GET : Récupérer les instruments disponibles
router.get("/available-instruments", courseController.getAvailableInstruments);

// GET : Récupérer des cours similaires
router.get("/similar-course/:id", courseController.getSimilarCourses);


// 📝 OPÉRATIONS DE MISE À JOUR
// PUT : Mettre à jour un cours par ID (accessible uniquement aux administrateurs et professeurs)
router.put("/:id", auth(["admin", "professor"]), upload.single('imageUrl'), handleMulterErrors, courseController.updateCourse);

// PUT : Mettre à jour le statut d'un cours par ID
router.put("/update-course-status/:id", courseController.updateCourseStatus);


// ❌ OPÉRATIONS DE SUPPRESSION
// DELETE : Supprimer un cours par ID (accessible uniquement aux administrateurs)
router.delete("/:id", auth(["admin", "manager"]), courseController.deleteCourse);

module.exports = router;