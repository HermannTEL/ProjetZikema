// controllers/videoCourseController.js
const VideoCourse = require('../Models/VideoCourse');
const User = require('../Models/User');
const { sendNotification } = require('./notification.controller');
const axios = require('axios');
const crypto = require('crypto');

// Configuration Zoom API
const ZOOM_API_KEY = process.env.ZOOM_API_KEY;
const ZOOM_API_SECRET = process.env.ZOOM_API_SECRET;
const ZOOM_ACCOUNT_EMAIL = process.env.ZOOM_ACCOUNT_EMAIL;
const ZOOM_BASE_URL = 'https://api.zoom.us/v2';

// Configuration Jitsi
const JITSI_DOMAIN = process.env.JITSI_DOMAIN || 'meet.jit.si';
const JITSI_APP_ID = process.env.JITSI_APP_ID;
const JITSI_APP_SECRET = process.env.JITSI_APP_SECRET;

console.log('VideoCourse controller loaded');

// Créer un token JWT pour Zoom
const generateZoomJWT = () => {
  const payload = {
    iss: ZOOM_API_KEY,
    exp: new Date().getTime() + 60 * 60 * 1000 // expire dans 1 heure
  };

  // Créer un token JWT
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
  
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
    
  const signature = crypto
    .createHmac('sha256', ZOOM_API_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
    
  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

// Créer une réunion Zoom
const createZoomMeeting = async (topic, startTime, duration, teacherEmail) => {
  try {
    const token = generateZoomJWT();
    
    const response = await axios.post(
      `${ZOOM_BASE_URL}/users/${teacherEmail}/meetings`,
      {
        topic,
        type: 2, // Réunion programmée
        start_time: startTime,
        duration,
        timezone: 'Europe/Paris',
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: false,
          mute_upon_entry: true,
          waiting_room: true,
          audio: 'both',
          auto_recording: 'cloud'
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return {
      meetingId: response.data.id,
      joinUrl: response.data.join_url,
      password: response.data.password,
      hostUrl: response.data.start_url
    };
  } catch (error) {
    console.error('Erreur lors de la création de la réunion Zoom:', error.response?.data || error.message);
    throw new Error('Impossible de créer la réunion Zoom');
  }
};

// Générer un token pour Jitsi
const generateJitsiToken = (roomName, participantName, email, role = 'moderator') => {
  // Uniquement si on utilise JWT pour Jitsi, sinon on peut utiliser des URLs directes
  if (!JITSI_APP_ID || !JITSI_APP_SECRET) {
    return null;
  }
  
  const payload = {
    iss: JITSI_APP_ID,
    aud: 'jitsi',
    sub: JITSI_DOMAIN,
    room: roomName,
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // Expire dans 24 heures
    context: {
      user: {
        name: participantName,
        email: email,
        moderator: role === 'moderator'
      }
    }
  };

  // Créer un token JWT pour Jitsi
  return jwt.sign(payload, JITSI_APP_SECRET);
};

/**
 * Récupère tous les cours vidéo créés par un professeur donné.
 * @param {Object} req - Objet de requête Express
 * @param {Object} res - Objet de réponse Express
 */
exports.getVideoCourseByProf = async (req, res) => {
  const { profId } = req.params;
  // console.log(
  //   `Récupérer les cours vidéo créés par le professeur ${profId}`
  // );

  try {
    const videoCourses = await VideoCourse.find({ teacher: profId })
      .populate("teacher", "firstName lastName email") // pour infos du prof
      .sort({ createdAt: -1 }); // optionnel : les plus récents d'abord

    res.status(200).json({ success: true, data: videoCourses });
  } catch (error) {
    console.error("Erreur lors de la récupération des cours vidéo :", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

// Créer une salle Jitsi
const createJitsiRoom = (title, teacherName, teacherEmail) => {
  // Créer un nom de salle unique et sécurisé
  const roomName = `musicschool_${title.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}`;
  
  const moderatorToken = generateJitsiToken(roomName, teacherName, teacherEmail, 'moderator');
  
  return {
    roomName,
    domain: JITSI_DOMAIN,
    moderatorToken,
    hostUrl: `https://${JITSI_DOMAIN}/${roomName}${moderatorToken ? `?jwt=${moderatorToken}` : ''}`,
    joinUrl: `https://${JITSI_DOMAIN}/${roomName}`
  };
};

// Récupérer tous les cours vidéo
exports.getAllVideoCourses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    let query = {};
    
    // Filtres
    if (req.query.instrument) {
      query.instrument = { $in: [req.query.instrument] };
    }
    
    if (req.query.level) {
      query.level = req.query.level;
    }
    
    if (req.query.type) {
      query.type = req.query.type;
    }
    
    if (req.query.status) {
      query.status = req.query.status;
    } else {
      // Par défaut, ne montre que les cours publiés
      query.status = 'published';
    }
    
    if (req.query.teacher) {
      query.teacher = req.query.teacher;
    }
    
    if (req.query.isFree) {
      query.isFree = req.query.isFree === 'true';
    }
    
    // Recherche texte
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }
    
    const videoCourses = await VideoCourse.find(query)
      .populate('teacher', 'firstName lastName')
      .select('-reviews')
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await VideoCourse.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: videoCourses.length,
      total,
      data: videoCourses,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Récupérer un cours vidéo par ID
exports.getVideoCourseById = async (req, res) => {
  try {
    const videoCourse = await VideoCourse.findById(req.params.id)
      .populate('teacher', 'firstName lastName email bio profileImage')
      .populate('reviews.user', 'firstName lastName profileImage');
    
    if (!videoCourse) {
      return res.status(404).json({
        success: false,
        error: 'Cours vidéo non trouvé'
      });
    }
    
    res.status(200).json({
      success: true,
      data: videoCourse
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Créer un nouveau cours vidéo
exports.createVideoCourse = async (req, res) => {
  try {
    const newVideoCourse = await VideoCourse.create(req.body);
    
    // Si le cours est de type live et a une date programmée, créer une réunion vidéo
    if (
      (newVideoCourse.type === 'live' || newVideoCourse.type === 'webinar' || newVideoCourse.type === 'masterclass') &&
      newVideoCourse.liveSession && 
      newVideoCourse.liveSession.date
    ) {
      const teacher = await User.findById(newVideoCourse.teacher);
      
      if (newVideoCourse.liveSession.platform === 'zoom') {
        try {
          // Calculer la durée en minutes
          const duration = newVideoCourse.liveSession.duration || 60;
          
          const zoomMeeting = await createZoomMeeting(
            newVideoCourse.title,
            new Date(newVideoCourse.liveSession.date).toISOString(),
            duration,
            teacher.email
          );
          
          newVideoCourse.liveSession.meetingId = zoomMeeting.meetingId;
          newVideoCourse.liveSession.joinUrl = zoomMeeting.joinUrl;
          newVideoCourse.liveSession.hostUrl = zoomMeeting.hostUrl;
          newVideoCourse.liveSession.password = zoomMeeting.password;
          
        } catch (error) {
          console.error('Erreur lors de la création de la réunion Zoom:', error);
          // Continuer malgré l'erreur Zoom
        }
      } else if (newVideoCourse.liveSession.platform === 'jitsi') {
        // Créer une salle Jitsi
        const jitsiRoom = createJitsiRoom(
          newVideoCourse.title,
          `${teacher.firstName} ${teacher.lastName}`,
          teacher.email
        );
        
        newVideoCourse.liveSession.roomName = jitsiRoom.roomName;
        newVideoCourse.liveSession.joinUrl = jitsiRoom.joinUrl;
        newVideoCourse.liveSession.hostUrl = jitsiRoom.hostUrl;
      }
      
      await newVideoCourse.save();
    }
    
    // Si le cours est directement publié, ajouter la date de publication
    if (newVideoCourse.status === 'published') {
      newVideoCourse.publishedAt = Date.now();
      await newVideoCourse.save();
    }
    
    res.status(201).json({
      success: true,
      data: newVideoCourse
    });
  } catch (error) {
    console.error('Erreur lors de la création du cours:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// Mettre à jour un cours vidéo
exports.updateVideoCourse = async (req, res) => {
  try {
    const videoCourse = await VideoCourse.findById(req.params.id);
    
    if (!videoCourse) {
      return res.status(404).json({
        success: false,
        error: 'Cours vidéo non trouvé'
      });
    }
    
    // Si le statut passe à "published", ajouter la date de publication
    if (req.body.status === 'published' && videoCourse.status !== 'published') {
      req.body.publishedAt = Date.now();
      
      // Notifier les utilisateurs intéressés par ce type d'instrument
      const interestedUsers = await User.find({
        'preferences.instruments': { $in: videoCourse.instrument }
      }).select('_id');
      
      for (const user of interestedUsers) {
        await sendNotification(
          user._id,
          'videoCourse',
          'Nouveau cours vidéo disponible',
          `Un nouveau cours vidéo "${videoCourse.title}" pour ${videoCourse.instrument.join(', ')} est maintenant disponible`,
          { videoCourseId: videoCourse._id }
        );
      }
    }
    
    // Si la date de la session live a changé, mettre à jour la réunion
    if (
      req.body.liveSession && 
      req.body.liveSession.date && 
      videoCourse.liveSession && 
      new Date(req.body.liveSession.date).getTime() !== new Date(videoCourse.liveSession.date).getTime()
    ) {
      const teacher = await User.findById(videoCourse.teacher);
      
      // Pour Zoom, il faut supprimer et recréer la réunion
      if (req.body.liveSession.platform === 'zoom' || videoCourse.liveSession.platform === 'zoom') {
        try {
          // Si une réunion existante, la supprimer
          if (videoCourse.liveSession.meetingId) {
            const token = generateZoomJWT();
            try {
              await axios.delete(
                `${ZOOM_BASE_URL}/meetings/${videoCourse.liveSession.meetingId}`,
                {
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                }
              );
            } catch (error) {
              console.error('Erreur lors de la suppression de la réunion Zoom:', error.response?.data || error.message);
            }
          }
          
          // Créer une nouvelle réunion
          if (req.body.liveSession.platform === 'zoom') {
            const duration = req.body.liveSession.duration || 60;
            
            const zoomMeeting = await createZoomMeeting(
              videoCourse.title,
              new Date(req.body.liveSession.date).toISOString(),
              duration,
              teacher.email
            );
            
            req.body.liveSession.meetingId = zoomMeeting.meetingId;
            req.body.liveSession.joinUrl = zoomMeeting.joinUrl;
            req.body.liveSession.hostUrl = zoomMeeting.hostUrl;
            req.body.liveSession.password = zoomMeeting.password;
          }
        } catch (error) {
          console.error('Erreur avec l\'API Zoom:', error);
        }
      } 
      
      // Pour Jitsi, créer une nouvelle salle
      if (req.body.liveSession.platform === 'jitsi') {
        const jitsiRoom = createJitsiRoom(
          videoCourse.title,
          `${teacher.firstName} ${teacher.lastName}`,
          teacher.email
        );
        
        req.body.liveSession.roomName = jitsiRoom.roomName;
        req.body.liveSession.joinUrl = jitsiRoom.joinUrl;
        req.body.liveSession.hostUrl = jitsiRoom.hostUrl;
      }
      
      // Notifier les participants du changement
      if (videoCourse.liveSession.registeredParticipants && videoCourse.liveSession.registeredParticipants.length > 0) {
        for (const participantId of videoCourse.liveSession.registeredParticipants) {
          await sendNotification(
            participantId,
            'videoCourse',
            'Modification de la session live',
            `La date de la session live "${videoCourse.title}" a été modifiée. Nouvelle date: ${new Date(req.body.liveSession.date).toLocaleDateString()} à ${new Date(req.body.liveSession.date).toLocaleTimeString()}`,
            { videoCourseId: videoCourse._id }
          );
        }
      }
    }
    
    // Mise à jour du cours
    const updatedVideoCourse = await VideoCourse.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: updatedVideoCourse
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du cours:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Supprimer un cours vidéo
exports.deleteVideoCourse = async (req, res) => {
  try {
    const videoCourse = await VideoCourse.findById(req.params.id);
    
    if (!videoCourse) {
      return res.status(404).json({
        success: false,
        error: 'Cours vidéo non trouvé'
      });
    }
    
    // Supprimer la réunion Zoom associée si elle existe
    if (
      videoCourse.liveSession && 
      videoCourse.liveSession.platform === 'zoom' && 
      videoCourse.liveSession.meetingId
    ) {
      try {
        const token = generateZoomJWT();
        await axios.delete(
          `${ZOOM_BASE_URL}/meetings/${videoCourse.liveSession.meetingId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
      } catch (error) {
        console.error('Erreur lors de la suppression de la réunion Zoom:', error.response?.data || error.message);
      }
    }
    
    // Notifier les participants inscrits
    if (
      videoCourse.liveSession && 
      videoCourse.liveSession.registeredParticipants && 
      videoCourse.liveSession.registeredParticipants.length > 0
    ) {
      for (const participantId of videoCourse.liveSession.registeredParticipants) {
        await sendNotification(
          participantId,
          'videoCourse',
          'Annulation de la session live',
          `La session live "${videoCourse.title}" a été annulée.`,
          {}
        );
      }
    }
    
    await videoCourse.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Cours vidéo supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Ajouter un avis/commentaire sur un cours vidéo
exports.addReview = async (req, res) => {
  try {
    const videoCourse = await VideoCourse.findById(req.params.id);
    
    if (!videoCourse) {
      return res.status(404).json({
        success: false,
        error: 'Cours vidéo non trouvé'
      });
    }
    
    const { rating, comment, userId } = req.body;
    const user = userId;
    
    // Vérifier si l'utilisateur a déjà laissé un avis
    const reviewIndex = videoCourse.reviews.findIndex(
      review => review.user.toString() === user.toString()
    );
    
    if (reviewIndex > -1) {
      // Mettre à jour l'avis existant
      videoCourse.reviews[reviewIndex].rating = rating;
      videoCourse.reviews[reviewIndex].comment = comment;
      videoCourse.reviews[reviewIndex].date = Date.now();
    } else {
      // Ajouter un nouvel avis
      videoCourse.reviews.push({
        user,
        rating,
        comment,
        date: Date.now()
      });
    }
    
    // Recalculer la moyenne des notes
    const totalRating = videoCourse.reviews.reduce((sum, item) => sum + item.rating, 0);
    videoCourse.rating.average = totalRating / videoCourse.reviews.length;
    videoCourse.rating.count = videoCourse.reviews.length;
    
    await videoCourse.save();
    
    // Notifier le professeur
    await sendNotification(
      videoCourse.teacher,
      'videoCourse',
      'Nouvel avis sur votre cours',
      `Un nouvel avis a été publié sur votre cours "${videoCourse.title}"`,
      { videoCourseId: videoCourse._id }
    );
    
    res.status(200).json({
      success: true,
      data: videoCourse
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Gérer les participants à une session live
exports.manageLiveParticipants = async (req, res) => {
  try {
    const videoCourse = await VideoCourse.findById(req.params.id);
    
    if (!videoCourse) {
      return res.status(404).json({
        success: false,
        error: 'Cours vidéo non trouvé'
      });
    }
    
    // Vérifier que c'est un cours live
    if (videoCourse.type !== 'live' && videoCourse.type !== 'webinar' && videoCourse.type !== 'masterclass') {
      return res.status(400).json({
        success: false,
        error: 'Ce cours n\'est pas de type live'
      });
    }
    
    const { action, userId } = req.body;
    
    if (!videoCourse.liveSession) {
      videoCourse.liveSession = {
        registeredParticipants: []
      };
    }
    
    if (action === 'register') {
      // Vérifier si le nombre maximum de participants est atteint
      if (
        videoCourse.liveSession.maxParticipants && 
        videoCourse.liveSession.registeredParticipants.length >= videoCourse.liveSession.maxParticipants
      ) {
        return res.status(400).json({
          success: false,
          error: 'Le nombre maximum de participants est déjà atteint'
        });
      }
      
      // Vérifier si l'utilisateur est déjà inscrit
      if (!videoCourse.liveSession.registeredParticipants.includes(userId)) {
        videoCourse.liveSession.registeredParticipants.push(userId);
        
        // Récupérer les infos de l'utilisateur
        const user = await User.findById(userId);
        
        // Si c'est une réunion Zoom et avec un mot de passe, envoyer les détails de connexion à l'utilisateur
        if (videoCourse.liveSession.platform === 'zoom' && videoCourse.liveSession.password) {
          await sendNotification(
            userId,
            'videoCourse',
            'Détails de connexion à la session live',
            `Vous êtes inscrit à la session live "${videoCourse.title}" le ${new Date(videoCourse.liveSession.date).toLocaleDateString()}. Lien de connexion: ${videoCourse.liveSession.joinUrl}. Mot de passe: ${videoCourse.liveSession.password}`,
            { videoCourseId: videoCourse._id }
          );
        } else {
          // Pour Jitsi ou Zoom sans mot de passe
          await sendNotification(
            userId,
            'videoCourse',
            'Inscription à une session live',
            `Vous êtes inscrit à la session live "${videoCourse.title}" le ${new Date(videoCourse.liveSession.date).toLocaleDateString()}. Lien de connexion: ${videoCourse.liveSession.joinUrl}`,
            { videoCourseId: videoCourse._id }
          );
        }
        
        // Si c'est Jitsi, générer un token participant spécifique
        if (videoCourse.liveSession.platform === 'jitsi' && user) {
          // Générer un token spécifique pour ce participant
          const participantToken = generateJitsiToken(
            videoCourse.liveSession.roomName,
            `${user.firstName} ${user.lastName}`,
            user.email,
            'participant'
          );
          
          // Stocker ce token dans le document utilisateur
          if (participantToken) {
            if (!user.videoConferences) {
              user.videoConferences = [];
            }
            
            // Supprimer toute référence précédente à cette salle
            user.videoConferences = user.videoConferences.filter(
              conf => conf.roomName !== videoCourse.liveSession.roomName
            );
            
            // Ajouter la nouvelle référence
            user.videoConferences.push({
              provider: 'jitsi',
              roomName: videoCourse.liveSession.roomName,
              token: participantToken,
              joinUrl: `${videoCourse.liveSession.joinUrl}?jwt=${participantToken}`,
              courseName: videoCourse.title,
              validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000) // Valide 24h
            });
            
            await user.save();
            
            // Envoyer le lien avec token à l'utilisateur
            await sendNotification(
              userId,
              'videoCourse',
              'Lien personnel pour la session live',
              `Voici votre lien personnel pour accéder à la session live "${videoCourse.title}": ${user.videoConferences[user.videoConferences.length-1].joinUrl}`,
              { videoCourseId: videoCourse._id }
            );
          }
        }
      }
    } else if (action === 'unregister') {
      // Retirer l'utilisateur de la liste
      videoCourse.liveSession.registeredParticipants = videoCourse.liveSession.registeredParticipants.filter(
        id => id.toString() !== userId.toString()
      );
      
      // Notifier l'utilisateur
      await sendNotification(
        userId,
        'videoCourse',
        'Désinscription d\'une session live',
        `Vous êtes désinscrit de la session live "${videoCourse.title}"`,
        { videoCourseId: videoCourse._id }
      );
      
      // Si c'est Jitsi, supprimer la référence au token
      const user = await User.findById(userId);
      if (user && user.videoConferences && videoCourse.liveSession.platform === 'jitsi') {
        user.videoConferences = user.videoConferences.filter(
          conf => conf.roomName !== videoCourse.liveSession.roomName
        );
        
        await user.save();
      }
    }
    
    await videoCourse.save();
    
    res.status(200).json({
      success: true,
      data: videoCourse
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Démarrer une session live
exports.startLiveSession = async (req, res) => {
  try {
    const videoCourse = await VideoCourse.findById(req.params.id);
    
    if (!videoCourse) {
      return res.status(404).json({
        success: false,
        error: 'Cours vidéo non trouvé'
      });
    }
    
    // Vérifier que l'utilisateur est bien le professeur du cours
    if (videoCourse.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Vous n\'êtes pas autorisé à démarrer cette session'
      });
    }
    
    // Vérifier que c'est un cours live
    if (videoCourse.type !== 'live' && videoCourse.type !== 'webinar' && videoCourse.type !== 'masterclass') {
      return res.status(400).json({
        success: false,
        error: 'Ce cours n\'est pas de type live'
      });
    }
    
    // Marquer la session comme active
    if (!videoCourse.liveSession) {
      videoCourse.liveSession = {};
    }
    
    videoCourse.liveSession.isActive = true;
    videoCourse.liveSession.startedAt = Date.now();
    
    await videoCourse.save();
    
    // Notifier tous les participants inscrits
    if (videoCourse.liveSession.registeredParticipants && videoCourse.liveSession.registeredParticipants.length > 0) {
      for (const participantId of videoCourse.liveSession.registeredParticipants) {
        await sendNotification(
          participantId,
          'videoCourse',
          'Session live démarrée',
          `La session live "${videoCourse.title}" vient de démarrer. Rejoignez-la maintenant: ${videoCourse.liveSession.joinUrl}`,
          { videoCourseId: videoCourse._id }
        );
      }
    }
    
    res.status(200).json({
      success: true,
      data: {
        isActive: true,
        hostUrl: videoCourse.liveSession.hostUrl || videoCourse.liveSession.joinUrl
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Terminer une session live
exports.endLiveSession = async (req, res) => {
  try {
    const videoCourse = await VideoCourse.findById(req.params.id);
    
    if (!videoCourse) {
      return res.status(404).json({
        success: false,
        error: 'Cours vidéo non trouvé'
      });
    }
    
    // Vérifier que l'utilisateur est bien le professeur du cours
    if (videoCourse.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Vous n\'êtes pas autorisé à terminer cette session'
      });
    }
    
    // Marquer la session comme terminée
    if (videoCourse.liveSession) {
      videoCourse.liveSession.isActive = false;
      videoCourse.liveSession.endedAt = Date.now();
      
      if (videoCourse.liveSession.startedAt) {
        // Calculer la durée réelle en minutes
        const duration = Math.round((Date.now() - new Date(videoCourse.liveSession.startedAt).getTime()) / 60000);
        videoCourse.liveSession.actualDuration = duration;
      }
    }
    
    await videoCourse.save();
    
    // Notifier tous les participants
    if (videoCourse.liveSession && videoCourse.liveSession.registeredParticipants && videoCourse.liveSession.registeredParticipants.length > 0) {
      for (const participantId of videoCourse.liveSession.registeredParticipants) {
        await sendNotification(
          // Suite du code pour la fonction endLiveSession
          participantId,
          'videoCourse',
          'Session live terminée',
          `La session live "${videoCourse.title}" est maintenant terminée. Merci de votre participation!`,
          { videoCourseId: videoCourse._id }
        );
      }
    }
    
    res.status(200).json({
      success: true,
      message: 'Session live terminée avec succès'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Obtenir un lien personnalisé pour un participant
exports.getParticipantLink = async (req, res) => {
  try {
    console.log(req);
    // Récupérer les informations de la session live
    const { courseId } = req.params;
    const userId = req.user._id;
    
    const videoCourse = await VideoCourse.findById(courseId);
    
    if (!videoCourse) {
      return res.status(404).json({
        success: false,
        error: 'Cours vidéo non trouvé'
      });
    }
    
    // Vérifier que l'utilisateur est bien inscrit
    if (
      !videoCourse.liveSession || 
      !videoCourse.liveSession.registeredParticipants ||
      !videoCourse.liveSession.registeredParticipants.includes(userId)
    ) {
      return res.status(403).json({
        success: false,
        error: 'Vous n\'êtes pas inscrit à cette session'
      });
    }
    
    // Si c'est Zoom, retourner simplement le lien de connexion
    if (videoCourse.liveSession.platform === 'zoom') {
      return res.status(200).json({
        success: true,
        data: {
          platform: 'zoom',
          joinUrl: videoCourse.liveSession.joinUrl,
          password: videoCourse.liveSession.password || null
        }
      });
    }
    
    // Pour Jitsi, générer un token personnalisé si nécessaire
    if (videoCourse.liveSession.platform === 'jitsi') {
      const user = await User.findById(userId);
      
      // Vérifier si un token existe déjà et s'il est valide
      let existingJitsiInfo = null;
      if (user.videoConferences) {
        existingJitsiInfo = user.videoConferences.find(
          conf => conf.roomName === videoCourse.liveSession.roomName && 
                 new Date(conf.validUntil) > new Date()
        );
      }
      
      if (existingJitsiInfo) {
        // Utiliser le token existant
        return res.status(200).json({
          success: true,
          data: {
            platform: 'jitsi',
            joinUrl: existingJitsiInfo.joinUrl,
            token: existingJitsiInfo.token
          }
        });
      } else {
        // Générer un nouveau token
        const participantToken = generateJitsiToken(
          videoCourse.liveSession.roomName,
          `${user.firstName} ${user.lastName}`,
          user.email,
          'participant'
        );
        
        // Construire l'URL de connexion
        const joinUrl = participantToken 
          ? `${videoCourse.liveSession.joinUrl}?jwt=${participantToken}`
          : videoCourse.liveSession.joinUrl;
        
        // Stocker le token dans le document utilisateur
        if (!user.videoConferences) {
          user.videoConferences = [];
        }
        
        // Supprimer toute référence précédente à cette salle
        user.videoConferences = user.videoConferences.filter(
          conf => conf.roomName !== videoCourse.liveSession.roomName
        );
        
        // Ajouter la nouvelle référence
        if (participantToken) {
          user.videoConferences.push({
            provider: 'jitsi',
            roomName: videoCourse.liveSession.roomName,
            token: participantToken,
            joinUrl,
            courseName: videoCourse.title,
            validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000) // Valide 24h
          });
          
          await user.save();
        }
        
        return res.status(200).json({
          success: true,
          data: {
            platform: 'jitsi',
            joinUrl,
            token: participantToken
          }
        });
      }
    }
    
    // Si on arrive ici, la plateforme n'est pas supportée
    return res.status(400).json({
      success: false,
      error: `Plateforme de visioconférence "${videoCourse.liveSession.platform}" non supportée`
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Récupérer les cours vidéo recommandés pour un utilisateur
exports.getRecommendedCourses = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Récupérer les préférences de l'utilisateur
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
    }
    
    let query = {
      status: 'published'
    };
    
    // Filtrer par instruments préférés si disponibles
    if (user.preferences && user.preferences.instruments && user.preferences.instruments.length > 0) {
      query.instrument = { $in: user.preferences.instruments };
    }
    
    // Filtrer par niveau si disponible
    if (user.preferences && user.preferences.level) {
      query.level = user.preferences.level;
    }
    
    const videoCourses = await VideoCourse.find(query)
      .populate('teacher', 'firstName lastName')
      .sort({ rating: -1, publishedAt: -1 })
      .limit(10);
    
    res.status(200).json({
      success: true,
      count: videoCourses.length,
      data: videoCourses
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Générer un rapport sur les sessions live
exports.getLiveSessionsReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const teacherId = req.query.teacherId;
    
    let dateFilter = {};
    
    if (startDate && endDate) {
      dateFilter = {
        'liveSession.date': {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    } else if (startDate) {
      dateFilter = {
        'liveSession.date': { $gte: new Date(startDate) }
      };
    } else if (endDate) {
      dateFilter = {
        'liveSession.date': { $lte: new Date(endDate) }
      };
    }
    
    const query = {
      teacher: teacherId,
      type: { $in: ['live', 'webinar', 'masterclass'] },
      ...dateFilter
    };
    
    const liveSessions = await VideoCourse.find(query)
      .populate('teacher', 'firstName lastName')
      .sort({ 'liveSession.date': -1 });
    
    // Préparer les statistiques
    let stats = {
      totalSessions: liveSessions.length,
      completedSessions: 0,
      upcomingSessions: 0,
      totalParticipants: 0,
      averageParticipants: 0,
      platformStats: {
        zoom: 0,
        jitsi: 0,
        other: 0
      }
    };
    
    const now = new Date();
    
    // Calculer les statistiques
    liveSessions.forEach(session => {
      // Vérifier si la session est passée ou à venir
      if (session.liveSession && session.liveSession.date) {
        if (new Date(session.liveSession.date) < now) {
          stats.completedSessions++;
        } else {
          stats.upcomingSessions++;
        }
      }
      
      // Compter les participants
      if (session.liveSession && session.liveSession.registeredParticipants) {
        stats.totalParticipants += session.liveSession.registeredParticipants.length;
      }
      
      // Statistiques par plateforme
      if (session.liveSession && session.liveSession.platform) {
        if (session.liveSession.platform === 'zoom') {
          stats.platformStats.zoom++;
        } else if (session.liveSession.platform === 'jitsi') {
          stats.platformStats.jitsi++;
        } else {
          stats.platformStats.other++;
        }
      }
    });
    
    // Calculer la moyenne des participants par session
    if (stats.totalSessions > 0) {
      stats.averageParticipants = Math.round(stats.totalParticipants / stats.totalSessions);
    }
    
    res.status(200).json({
      success: true,
      count: liveSessions.length,
      data: liveSessions,
      stats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Récupérer les enregistrements d'une session
exports.getSessionRecordings = async (req, res) => {
  try {
    const { id } = req.params;
    
    const videoCourse = await VideoCourse.findById(id);
    
    if (!videoCourse) {
      return res.status(404).json({
        success: false,
        error: 'Cours vidéo non trouvé'
      });
    }
    
    // Pour les enregistrements Zoom, récupérer depuis l'API Zoom
    if (
      videoCourse.liveSession && 
      videoCourse.liveSession.platform === 'zoom' && 
      videoCourse.liveSession.meetingId &&
      videoCourse.liveSession.endedAt // La session doit être terminée
    ) {
      try {
        const token = generateZoomJWT();
        
        const response = await axios.get(
          `${ZOOM_BASE_URL}/meetings/${videoCourse.liveSession.meetingId}/recordings`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        // Stocker les URLs d'enregistrement dans le document
        if (response.data && response.data.recording_files && response.data.recording_files.length > 0) {
          if (!videoCourse.liveSession.recordings) {
            videoCourse.liveSession.recordings = [];
          }
          
          // Mapper les données de l'API Zoom
          const zoomRecordings = response.data.recording_files.map(recording => ({
            id: recording.id,
            url: recording.download_url,
            playUrl: recording.play_url,
            fileType: recording.file_type,
            fileSize: recording.file_size,
            recordingStart: recording.recording_start,
            recordingEnd: recording.recording_end
          }));
          
          // Mettre à jour avec les nouveaux enregistrements
          videoCourse.liveSession.recordings = zoomRecordings;
          await videoCourse.save();
        }
        
        return res.status(200).json({
          success: true,
          data: {
            recordings: videoCourse.liveSession.recordings || []
          }
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des enregistrements Zoom:', error.response?.data || error.message);
        
        // Retourner les enregistrements stockés en cas d'erreur avec l'API Zoom
        return res.status(200).json({
          success: true,
          data: {
            recordings: videoCourse.liveSession.recordings || [],
            apiError: 'Impossible de récupérer les enregistrements à jour depuis Zoom'
          }
        });
      }
    } else {
      // Pour les autres plateformes ou si pas d'enregistrements
      return res.status(200).json({
        success: true,
        data: {
          recordings: videoCourse.liveSession?.recordings || []
        }
      });
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des enregistrements:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Ajouter manuellement un enregistrement
exports.addRecording = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, url, description } = req.body;
    
    const videoCourse = await VideoCourse.findById(id);
    
    if (!videoCourse) {
      return res.status(404).json({
        success: false,
        error: 'Cours vidéo non trouvé'
      });
    }
    
    // Vérifier que l'utilisateur est bien le professeur du cours
    if (videoCourse.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Vous n\'êtes pas autorisé à ajouter un enregistrement à cette session'
      });
    }
    
    if (!videoCourse.liveSession) {
      videoCourse.liveSession = {};
    }
    
    if (!videoCourse.liveSession.recordings) {
      videoCourse.liveSession.recordings = [];
    }
    
    // Ajouter l'enregistrement manuellement
    videoCourse.liveSession.recordings.push({
      id: Date.now().toString(), // ID unique
      title,
      url,
      description,
      fileType: 'custom',
      addedAt: new Date()
    });
    
    await videoCourse.save();
    
    // Notifier les participants
    if (videoCourse.liveSession.registeredParticipants && videoCourse.liveSession.registeredParticipants.length > 0) {
      for (const participantId of videoCourse.liveSession.registeredParticipants) {
        await sendNotification(
          participantId,
          'videoCourse',
          'Nouvel enregistrement disponible',
          `Un nouvel enregistrement est disponible pour la session "${videoCourse.title}"`,
          { videoCourseId: videoCourse._id }
        );
      }
    }
    
    res.status(200).json({
      success: true,
      data: {
        recordings: videoCourse.liveSession.recordings
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Supprimer un enregistrement
exports.deleteRecording = async (req, res) => {
  try {
    const { id, recordingId } = req.params;
    
    const videoCourse = await VideoCourse.findById(id);
    
    if (!videoCourse) {
      return res.status(404).json({
        success: false,
        error: 'Cours vidéo non trouvé'
      });
    }
    
    // Vérifier que l'utilisateur est bien le professeur du cours
    if (videoCourse.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Vous n\'êtes pas autorisé à supprimer un enregistrement de cette session'
      });
    }
    
    if (
      !videoCourse.liveSession || 
      !videoCourse.liveSession.recordings || 
      videoCourse.liveSession.recordings.length === 0
    ) {
      return res.status(404).json({
        success: false,
        error: 'Aucun enregistrement trouvé'
      });
    }
    
    // Pour Zoom, supprimer également dans l'API Zoom si possible
    const recordingToDelete = videoCourse.liveSession.recordings.find(
      rec => rec.id.toString() === recordingId.toString()
    );
    
    if (
      recordingToDelete && 
      videoCourse.liveSession.platform === 'zoom' && 
      recordingToDelete.fileType !== 'custom'
    ) {
      try {
        const token = generateZoomJWT();
        
        await axios.delete(
          `${ZOOM_BASE_URL}/meetings/${videoCourse.liveSession.meetingId}/recordings/${recordingId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'enregistrement Zoom:', error.response?.data || error.message);
        // Continuer malgré l'erreur avec Zoom API
      }
    }
    
    // Supprimer l'enregistrement de notre base de données
    videoCourse.liveSession.recordings = videoCourse.liveSession.recordings.filter(
      rec => rec.id.toString() !== recordingId.toString()
    );
    
    await videoCourse.save();
    
    res.status(200).json({
      success: true,
      data: {
        recordings: videoCourse.liveSession.recordings
      }
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'enregistrement:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};