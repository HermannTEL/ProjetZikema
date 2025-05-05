// routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const {sendMessage, saveDraft, getMessages, moveToTrash, restoreMessage, deleteMessage} = require('../Controllers/message.controller');
// const { protect } = require('../middlewares/auth');

// Envoie un message
router.post('/send', sendMessage);

// Sauvegarde un brouillon
router.post('/draft', saveDraft);

// Récupère les messages selon la vue (boîte de réception, sent, draft, trash)
router.post('/get_messages/:currentUserId', getMessages);

// Déplace un message dans la corbeille
router.put('/trash/:messageId/&/:currentUserId', moveToTrash);

// Restaure un message de la corbeille
router.put('/restore/:messageId/&/:currentUserId', restoreMessage);

// Supprime un message définitivement
router.delete('/delete/:messageId/&/:currentUserId', deleteMessage);

module.exports = router;

// // Envoie un message
// router.post('/send', protect, sendMessage);

// // Sauvegarde un brouillon
// router.post('/draft', protect, saveDraft);

// router.get('/get_messages/:userId', protect, getAllMessages);

// // Récupère les messages de la boîte de réception
// router.get('/inbox/:userId', protect, getInbox);

// // Récupère les messages envoyés
// router.get('/sent', protect, getSentMessages);

// // Déplace un message dans la corbeille
// router.put('/trash/:messageId', protect, moveToTrash);

// // Restaure un message de la corbeille
// router.put('/restore/:messageId', protect, restoreMessage);

// // Supprime un message définitivement
// router.delete('/delete/:messageId', protect, deleteMessage);