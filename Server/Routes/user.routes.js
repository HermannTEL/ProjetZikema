const express = require("express");
const router = express.Router();
const userController = require('../Controllers/user.controller');
const {auth: authMiddleware} = require('../Conf/Middlewares/auth');
const {upload, handleMulterErrors} = require('../Conf/Middlewares/multerConfig')

// 📄 ROUTES UTILISATEUR

// GET : Récupérer le profil de l'utilisateur connecté
router.get("/me/:id", authMiddleware(["student"]), userController.getMe);

// GET : Récupérer tous les utilisateurs (pour admin)
router.get("/", authMiddleware(["admin", "manager"]), userController.getAllUsers);

// GET : Récupérer un utilisateur par ID (pour admin)
router.get("/:id", authMiddleware(["admin"]), userController.getUserById);

// GET : Récupérer tous les professeurs
router.get("/professors", authMiddleware(["admin", "manager"]), userController.getAllProfessors);

// GET : Récupère tous les étudiants d'un professeur
router.get("/professor/:id/students", authMiddleware(["admin", "professor"]), userController.getProfStudents);


// POST : Demander la réinitialisation du mot de passe
router.post("/forgot-password", userController.forgotPassword);

// POST : Réinitialiser le mot de passe
router.post("/reset-password/:token", upload.single('image'), handleMulterErrors, userController.resetPassword);


// PUT : Mettre à jour un utilisateur (pour admin)
router.put("/:id", authMiddleware(["admin"]), upload.single('image'), handleMulterErrors, userController.updateUser );

// PUT : Mettre à jour le profil utilisateur
router.put("/me/:id", authMiddleware(["student", "professor", "manager", "admin"]), userController.updateProfile);

// PUT : Modifier le mot de passe
router.put("/me/password/:id", authMiddleware(["student"]), userController.updatePassword);

// PUT : Mettre à jour les disponibilités d'un professeur
router.put("/me/:id/availability", authMiddleware(["professor"]), userController.updateAvailability);

// PUT : Mettre à jour les préférences de notification
router.put("/me/:id/notification-preferences", authMiddleware(["student"]), userController.updateNotificationPreferences);

// DELETE : Supprimer un utilisateur (pour admin)
router.delete("/:id", authMiddleware(["admin"]), userController.deleteUser);

// PATCH : Activer/Désactiver un utilisateur (pour admin)
router.patch("/:id/toggle-status", authMiddleware(["admin"]), userController.toggleUserStatus);

module.exports = router;