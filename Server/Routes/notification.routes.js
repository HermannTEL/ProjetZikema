const express = require("express");
const router = express.Router();
const notificationController = require('../Controllers/notification.controller');
const { auth } = require('../Conf/Middlewares/auth');

// 📄 ROUTES NOTIFICATIONS

// GET : Récupérer toutes les notifications d'un utilisateur
router.get("/:userId", notificationController.getUserNotifications);

// GET : Compter les notifications non lues
router.get("/:userId/unread-count", auth(["user"]), notificationController.countUnread);


// POST : Créer une nouvelle notification
router.post("/", auth(["admin"]), notificationController.createNotification);


// PATCH : Marquer une notification comme lue
router.patch("/:id/read", auth(["user"]), notificationController.markAsRead);

// PATCH : Marquer toutes les notifications d'un utilisateur comme lues
router.patch("/:userId/read-all", auth(["user"]), notificationController.markAllAsRead);


// DELETE : Supprimer une notification
router.delete("/:id", auth(["user"]), notificationController.deleteNotification);

// DELETE : Supprimer toutes les notifications lues d'un utilisateur
router.delete("/:userId/read", auth(["user"]), notificationController.deleteReadNotifications);

// POST : Envoyer une notification (fonction utilitaire)
// Cette route n'est pas nécessaire si la fonction sendNotification est utilisée uniquement par d'autres services
// router.post("/send-notification", auth(["admin"]), notificationController.sendNotification);

module.exports = router;