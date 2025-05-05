const express = require("express");
const router = express.Router();
const videoCourseController = require('../Controllers/videoCourse.controller');
const {auth} = require('../Conf/Middlewares/auth');

// 📄 ROUTES COURS VIDÉO

// GET : Récupérer tous les cours vidéo
router.get("/", videoCourseController.getAllVideoCourses);

// GET : Récupérer un cours vidéo par ID
router.get("/:id", videoCourseController.getVideoCourseById);

router.get("/by-teacher/:profId", videoCourseController.getVideoCourseByProf);

// GET : Obtenir un lien personnalisé pour un participant
router.get("/:courseId/participant-link", auth(["user"]), videoCourseController.getParticipantLink);

// GET : Récupérer les cours vidéo recommandés pour un utilisateur
router.get("/recommended/:userId", auth(["user"]), videoCourseController.getRecommendedCourses);

// GET : Générer un rapport sur les sessions live
router.get("/live-sessions/report", auth(["admin", "professor"]), videoCourseController.getLiveSessionsReport);

// GET : Récupérer les enregistrements d'une session
router.get("/:id/recordings", auth(["professor"]), videoCourseController.getSessionRecordings);


// POST : Créer un nouveau cours vidéo
router.post("/", auth(["admin", "professor"]), videoCourseController.createVideoCourse);

// POST : Ajouter un avis/commentaire sur un cours vidéo
router.post("/:id/review", auth(["user"]), videoCourseController.addReview);

// POST : Gérer les participants à une session live
router.post("/:id/live-participants", auth(["user"]), videoCourseController.manageLiveParticipants);

// POST : Démarrer une session live
router.post("/:id/start-live", auth(["professor"]), videoCourseController.startLiveSession);

// POST : Terminer une session live
router.post("/:id/end-live", auth(["professor"]), videoCourseController.endLiveSession);

// POST : Ajouter manuellement un enregistrement
router.post("/:id/recordings", auth(["professor"]), videoCourseController.addRecording);


// PUT : Mettre à jour un cours vidéo
router.put("/:id", auth(["admin", "professor"]), videoCourseController.updateVideoCourse);


// DELETE : Supprimer un cours vidéo
router.delete("/:id", auth(["admin", "professor"]), videoCourseController.deleteVideoCourse);

// DELETE : Supprimer un enregistrement
router.delete("/:id/recordings/:recordingId", auth(["professor"]), videoCourseController.deleteRecording);

module.exports = router;