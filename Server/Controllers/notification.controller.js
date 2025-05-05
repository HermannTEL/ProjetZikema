// controllers/notificationController.js
const Notification = require('../Models/Notification');
const User = require('../Models/User');

console.log('Notification controller loaded');

// Récupérer toutes les notifications d'un utilisateur
exports.getUserNotifications = async (req, res) => {
  try {
    const userId = req.params.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Notification.countDocuments({ user: userId });
    
    // console.log(notifications);
    res.status(200).json({
      success: true,
      count: notifications.length,
      total,
      data: notifications,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Créer une nouvelle notification
exports.createNotification = async (req, res) => {
  try {
    const { user, title, message, ...rest } = req.body;

    // Si "all" => récupérer tous les utilisateurs
    if (user === "all") {
      const users = await User.find({});
      const notifications = await Promise.all(users.map(u =>
        Notification.create({ user: u._id, title, message, ...rest })
      ));

      return res.status(201).json({
        success: true,
        data: notifications,
        message: `${notifications.length} notifications créées pour tous les utilisateurs`
      });
    }

    // Sinon, création normale
    const notification = await Notification.create(req.body);
    res.status(201).json({ success: true, data: notification });

  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Marquer une notification comme lue
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification non trouvée'
      });
    }
    
    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Marquer toutes les notifications d'un utilisateur comme lues
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    await Notification.updateMany(
      { user: userId, isRead: false },
      { isRead: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'Toutes les notifications ont été marquées comme lues'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Supprimer une notification
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification non trouvée'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Notification supprimée avec succès'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Supprimer toutes les notifications lues d'un utilisateur
exports.deleteReadNotifications = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const result = await Notification.deleteMany({
      user: userId,
      isRead: true
    });
    
    res.status(200).json({
      success: true,
      message: `${result.deletedCount} notifications supprimées avec succès`
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Compter les notifications non lues
exports.countUnread = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const count = await Notification.countDocuments({
      user: userId,
      isRead: false
    });
    
    res.status(200).json({
      success: true,
      count
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Fonction utilitaire pour envoyer une notification (utilisable par d'autres services)
exports.sendNotification = async (userId, notificationType, title, message, relatedTo = null) => {
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }
    
    const notification = await Notification.create({
      user: userId,
      type: notificationType,
      title,
      message,
      relatedTo,
      isRead: false
    });
    
    // Ici, on pourrait implémenter l'envoi par email ou SMS selon les préférences de l'utilisateur
    if (user.notificationPreferences.email) {
      // Envoyer email
      // emailService.sendNotificationEmail(user.email, title, message);
    }
    
    if (user.notificationPreferences.sms && user.phone) {
      // Envoyer SMS
      // smsService.sendNotificationSMS(user.phone, message);
    }
    
    return notification;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de notification:', error);
    throw error;
  }
};