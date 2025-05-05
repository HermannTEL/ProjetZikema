// controllers/centerController.js
const Center = require('../Models/Center');
const User = require('../Models/User');
const { sendNotification } = require('./notification.controller');

console.log('Center controller loaded');

// Récupérer tous les centres
exports.getAllCenters = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        let query = {};
        
        // Filtres
        if (req.query.city) {
            query['address.city'] = new RegExp(req.query.city, 'i');
        }
        
        if (req.query.status) {
            query.status = req.query.status;
        }
        
        if (req.query.facilities) {
            query.facilities = { $in: req.query.facilities.split(',') };
        }
        
        const centers = await Center.find(query)
            .sort({ name: 1 })
            .skip(skip)
            .limit(limit);
        
        const total = await Center.countDocuments(query);
        
        // console.log(centers)
        // Structure de la réponse
        res.status(200).json({
            success: true,
            message: 'Centers retrieved successfully',
            data: {
                count: centers.length,
                total,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                centers // Renvoie les centres
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'An error occurred while retrieving centers',
            error: {
                message: error.message,
                code: error.code || 'INTERNAL_SERVER_ERROR' // Ajout d'un code d'erreur
            }
        });
    }
};

// Récupérer un centre par ID
exports.getCenterById = async (req, res) => {
    try {
        const center = await Center.findById(req.params.id)
        .populate('manager', 'firstName lastName email');
        
        if (!center) {
            return res.status(404).json({
                success: false,
                error: 'Centre non trouvé'
            });
        }
        
        res.status(200).json({
            success: true,
            data: center
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Trouver des centres à proximité
exports.getCentersNearby = async (req, res) => {
    try {
        const { longitude, latitude, maxDistance } = req.query;
        
        if (!longitude || !latitude) {
            return res.status(400).json({
                success: false,
                error: 'Coordonnées géographiques requises'
            });
        }
        
        // Distance en mètres (défaut: 10km)
        const distance = parseInt(maxDistance) || 10000;
        
        const centers = await Center.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(longitude), parseFloat(latitude)]
                    },
                    $maxDistance: distance
                }
            }
        }).limit(20);
        
        res.status(200).json({
            success: true,
            count: centers.length,
            data: centers
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Créer un nouveau centre
exports.createCenter = async (req, res) => {
    try {
        const newCenter = await Center.create(req.body);
        
        // Notifier le manager du centre s'il est défini
        if (req.body.manager) {
            await sendNotification(
                req.body.manager,
                'center',
                'Nouveau centre créé',
                `Vous avez été désigné manager du centre ${newCenter.name}`,
                { centerId: newCenter._id }
            );
        }
        
        res.status(201).json({
            success: true,
            data: newCenter
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Mettre à jour un centre
exports.updateCenter = async (req, res) => {
    try {
        const center = await Center.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!center) {
            return res.status(404).json({
                success: false,
                error: 'Centre non trouvé'
            });
        }
        
        // Notifier le manager si changement de statut
        if (req.body.status && center.manager) {
            await sendNotification(
                center.manager,
                'center',
                'Statut du centre modifié',
                `Le statut du centre ${center.name} a été changé à ${req.body.status}`,
                { centerId: center._id }
            );
        }
        
        res.status(200).json({
            success: true,
            data: center
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Supprimer un centre
exports.deleteCenter = async (req, res) => {
    try {
        const center = await Center.findById(req.params.id);
        
        if (!center) {
            return res.status(404).json({
                success: false,
                error: 'Centre non trouvé'
            });
        }
        
        // Conserver l'ID du manager pour la notification
        const managerId = center.manager;
        const centerName = center.name;
        
        await center.deleteOne();
        
        // Notifier le manager
        if (managerId) {
            await sendNotification(
                managerId,
                'center',
                'Centre supprimé',
                `Le centre ${centerName} a été supprimé`,
                null
            );
        }
        
        res.status(200).json({
            success: true,
            message: 'Centre supprimé avec succès'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Ajouter une salle à un centre
exports.addRoom = async (req, res) => {
    try {
        const center = await Center.findById(req.params.id);
        
        if (!center) {
            return res.status(404).json({
                success: false,
                error: 'Centre non trouvé'
            });
        }
        
        center.rooms.push(req.body);
        await center.save();
        
        // Notifier le manager
        if (center.manager) {
            await sendNotification(
                center.manager,
                'center',
                'Nouvelle salle ajoutée',
                `Une nouvelle salle (${req.body.name}) a été ajoutée au centre ${center.name}`,
                { centerId: center._id }
            );
        }
        
        res.status(200).json({
            success: true,
            data: center
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Mettre à jour une salle
exports.updateRoom = async (req, res) => {
    try {
        const center = await Center.findById(req.params.id);
        
        if (!center) {
            return res.status(404).json({
                success: false,
                error: 'Centre non trouvé'
            });
        }
        
        const roomIndex = center.rooms.findIndex(room => room._id.toString() === req.params.roomId);
        
        if (roomIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Salle non trouvée'
            });
        }
        
        // Mettre à jour les champs spécifiés
        Object.keys(req.body).forEach(key => {
            center.rooms[roomIndex][key] = req.body[key];
        });
        
        await center.save();
        
        res.status(200).json({
            success: true,
            data: center
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Supprimer une salle
exports.deleteRoom = async (req, res) => {
    try {
        const center = await Center.findById(req.params.id);
        
        if (!center) {
            return res.status(404).json({
                success: false,
                error: 'Centre non trouvé'
            });
        }
        
        const roomIndex = center.rooms.findIndex(room => room._id.toString() === req.params.roomId);
        
        if (roomIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Salle non trouvée'
            });
        }
        
        // Conserver le nom de la salle pour la notification
        const roomName = center.rooms[roomIndex].name;
        
        // Supprimer la salle
        center.rooms.splice(roomIndex, 1);
        await center.save();
        
        // Notifier le manager
        if (center.manager) {
            await sendNotification(
                center.manager,
                'center',
                'Salle supprimée',
                `La salle ${roomName} a été supprimée du centre ${center.name}`,
                { centerId: center._id }
            );
        }
        
        res.status(200).json({
            success: true,
            message: 'Salle supprimée avec succès'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.updateCenterStatus = async (req, res) => {
    try {

        const status = req.body.status; // 'active', 'inactive' ou 'under maintenance'
        if (!status) {
            return res.status(400).json({
                success: false,
                error: 'Statut requis'
            });
        }
        
        const center = await Center.findById(req.params.id);
        if (!center) {
            return res.status(404).json({
                success: false,
                error: 'Centre non trouvé'
            });
        }

        // Changer le statut du centre
        center.status = status;
        await center.save();
        
        res.status(200).json({
            success: true,
            data: center
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}