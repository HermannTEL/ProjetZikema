// controllers/messageController.js
const Message = require('../../../Models/Message');
const User = require('../../../Models/User');

// Envoie d'un message
const sendMessage = async (req, res) => {
    const { sender, recipient, subject, body } = req.body;

    try {
        const newMessage = new Message({
            sender,
            recipient,
            subject,
            body,
        });

        await newMessage.save();
        console.log('new message', newMessage);
        res.status(201).json({ message: 'Message sent successfully', data: newMessage });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error sending message', message: error.message });
    }
};

// Sauvegarde d'un message en brouillon
const saveDraft = async (req, res) => {
    const { sender, recipient, subject, body } = req.body;
    console.log('sent message', req.body);

    try {
        const draftMessage = new Message({
            sender,
            recipient,
            subject,
            body,
            draftStatus: {
                sender: true,
                recipient: false
            }
        });

        await draftMessage.save();
        res.status(201).json({ message: 'Draft saved successfully', data: draftMessage });
    } catch (error) {
        console.error('Error saving draft:', error); // Pour débogage
        res.status(500).json({ error: 'Error saving draft', details: error.message }); // Ajout des détails de l'erreur
    }
};

// Extracted function to retrieve messages
const getMessages = async (req, res) => {
    const { currentUserId } = req.params;
    const { view } = req.body;

    // console.log('Fetching messages for user:', currentUserId, 'View:', view);
    try {
        let messages;

        if (view === 'inbox') {
            // Récupérer uniquement les messages non supprimés pour le destinataire
            messages = await Message.find({
                recipient: currentUserId,
                "trashStatus.recipient": false
            }).populate('sender', 'firstname lastname email').populate('recipient', 'firstname lastname email');
        } else if (view === 'trash') {
            // Récupérer les messages supprimés soit par l'expéditeur, soit par le destinataire
            messages = await Message.find({
                $or: [
                    { sender: currentUserId, "trashStatus.sender": true },
                    { recipient: currentUserId, "trashStatus.recipient": true }
                ]
            }).populate('sender', 'firstname lastname email').populate('recipient', 'firstname lastname email');
        } else if (view === 'sent') {
            // Récupérer les messages envoyés et non supprimés par l'expéditeur
            messages = await Message.find({
                sender: currentUserId,
                "draftStatus.sender": false,
                "trashStatus.sender": false
            }).populate('sender', 'firstname lastname email').populate('recipient', 'firstname lastname email');
        } else if (view === 'drafts') {
            // Récupérer les messages en brouillon pour l'utilisateur actuel
            messages = await Message.find({
                sender: currentUserId,
                "draftStatus.sender": true,
                "trashStatus.sender": false
            }).populate('sender', 'firstname lastname email').populate('recipient', 'firstname lastname email');
        } else {
            // Si la vue est invalide, renvoyer une erreur 400
            return res.status(400).json({ error: 'Invalid view' });
        }

        // console.log('Found messages:', messages);

        // Renvoyer les messages trouvés
        return res.status(200).json({ messages });
    } catch (error) {
        console.error('Error fetching messages:', error);
        // Renvoyer une réponse d'erreur 500 en cas de problème serveur
        return res.status(500).json({ error: 'Error fetching messages' });
    }
};

// Déplacer un message dans la corbeille
const moveToTrash = async (req, res) => {
    const {messageId, currentUserId} = req.params;

    console.log('messageId & currentUserId ', messageId, currentUserId);

    try {
        // Récupérer le message par son ID
        const message = await Message.findById(messageId);

        // Vérifier si l'utilisateur actuel est l'expéditeur ou le destinataire
        if (message.sender._id.toString() === currentUserId) {
            // Mettre à jour le statut de la corbeille pour l'expéditeur
            message.trashStatus.sender = true;
        } else if (message.recipient._id.toString() === currentUserId) {
            // Mettre à jour le statut de la corbeille pour le destinataire
            message.trashStatus.recipient = true;
        } else {
            throw new Error("User not authorized to move this message to trash.");
        }

        // Sauvegarder les modifications
        await message.save();
        console.log('Message moved to trash for current user');
        return res.status(200).json({ message: 'Message moved to trash' });
    } catch (error) {
        console.error('Error moving message to trash:', error);
        // Renvoyer une réponse d'erreur 500 en cas de problème serveur
        return res.status(500).json({ error: 'Error moving message to trash', error });
    }
};

// Restaurer un message de la corbeille
const restoreMessage = async (req, res) => {
    const { messageId, currentUserId} = req.params;

    try {
        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }

        if (message.trashStatus.sender || message.trashStatus.recipient) {
            if (message.sender._id.toString() === currentUserId) {
                message.trashStatus.sender = false;
            } else if (message.recipient._id.toString() === currentUserId) {
                message.trashStatus.recipient = false;
            } else {
                throw new Error("User not authorized to restore this message.");
            }
            await message.save();
            console.log('Message restored from trash for current user');
        } else {
            throw new Error("Message is not in the trash.");
        }

        res.status(200).json({ message: 'Message restored from trash', message });
    } catch (error) {
        res.status(500).json({ error: 'Error restoring message' });
    }
};

// Supprimer définitivement un message
const deleteMessage = async (req, res) => {
    const { messageId, currentUserId } = req.params;
    console.log(messageId, currentUserId);
  
    try {
      const message = await Message.findById(messageId);
  
      if (!message) {
        return res.status(404).json({ error: 'Message not found' });
      }
  
      // Vérification des autorisations
      if (message.sender._id.toString() !== currentUserId && message.recipient._id.toString() !== currentUserId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }
  
      // Si l'utilisateur actuel est le sender et qu'il a déjà mis le message à la corbeille
      if (message.sender._id.toString() === currentUserId && message.trashStatus.sender || message.draftStatus.sender) {
        message.trashStatus.sender = null;
        message.draftStatus.sender = null;
        message.dateDeleted = new Date();
      }
  
      // Si l'utilisateur actuel est le recipient et qu'il a déjà mis le message à la corbeille
      if (message.recipient._id.toString() === currentUserId && message.trashStatus.recipient || message.draftStatus.recipient) {
        message.trashStatus.recipient = null;
        message.draftStatus.recipient = null;
        message.dateDeleted = new Date();
      }
  
      const deletion = await message.save();
  
      if (deletion) {
        console.log('Message permanently deleted');
        return res.status(200).json({ message: 'Message permanently deleted', message });
      }
    } catch (error) {
      console.error('Error deleting message permanently:', error);
      return res.status(500).json({ error: 'Error deleting message permanently' });
    }
  };

module.exports = {
    sendMessage,
    saveDraft,
    getMessages,
    moveToTrash,
    restoreMessage,
    deleteMessage,
}   