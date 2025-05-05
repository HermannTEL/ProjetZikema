console.log('upload.controller.js loaded');

// controllers/uploadController.js
const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Aucun fichier envoyé',
            });
        }

        const fileType = req.file.mimetype.split('/')[0];
        const filePath = req.file.path.replace(/\\/g, '/'); // Pour Windows compatibility
        const publicUrl = `${req.protocol}://${req.get('host')}/${filePath.replace('public/', '')}`;

        res.status(200).json({
        success: true,
        message: `${fileType} uploadé avec succès`,
        data: {
            originalName: req.file.originalname,
            fileName: req.file.filename,
            mimeType: req.file.mimetype,
            size: req.file.size,
            url: publicUrl
        }
        });

    } catch (error) {
        console.error('Erreur lors de l\'upload:', error);
        res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'upload',
        error: error.message
        });
    }
};


const uploadMultipleFiles = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Aucun fichier envoyé',
            });
        }

        const filesData = req.files.map(file => {
            const filePath = file.path.replace(/\\/g, '/');
            const publicUrl = `${req.protocol}://${req.get('host')}/${filePath.replace('public/', '')}`;

            return {
                originalName: file.originalname,
                fileName: file.filename,
                mimeType: file.mimetype,
                size: file.size,
                url: publicUrl
            };
        });

        res.status(200).json({
            success: true,
            message: `${req.files.length} fichiers uploadés avec succès`,
            data: filesData
        });

    } catch (error) {
        console.error('Erreur upload multiple:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'upload multiple',
            error: error.message
        });
    }
};

module.exports = {
    uploadFile,
    uploadMultipleFiles,
};
  