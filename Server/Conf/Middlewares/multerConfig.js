const multer = require('multer');
const path = require('path');
const fs = require('fs');
const slugify = require('slugify');

// Dossier de base pour tous les uploads
const baseUploadDir = path.join(__dirname, '../../public/uploads');

// Fonction pour créer les dossiers si ils n'existent pas
function ensureDirectoryExistence(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Fonction pour choisir le sous-dossier selon le type de fichier
function getSubdirectory(mimetype) {
  if (mimetype.startsWith('image/')) {
    return 'images';
  } else if (mimetype.startsWith('audio/')) {
    return 'audios';
  } else if (mimetype.startsWith('video/')) {
    return 'videos';
  } else if (
    mimetype === 'application/pdf' ||
    mimetype === 'application/msword' ||
    mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimetype === 'application/vnd.ms-powerpoint' ||
    mimetype === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ) {
    return 'documents';
  } else {
    return 'others';
  }
}

// Fonction pour déterminer dynamiquement le chemin d'upload selon userId
function getUploadPath(req, file) {
  const subDir = getSubdirectory(file.mimetype);
  
  let userId = 'Anonymous'; // Valeur par défaut
  if (req.user && req.user._id) {
    userId = req.user._id.toString();
  }

  const uploadPath = path.join(baseUploadDir, userId, subDir);
  ensureDirectoryExistence(uploadPath);
  return uploadPath;
}

// Définir le stockage dynamique avec Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      if (!file) {
        return cb(new Error("Aucun fichier fourni"), null);
      }
      const uploadPath = getUploadPath(req, file);
      cb(null, uploadPath);
    } catch (error) {
      cb(error, null);
    }
  },
  filename: function (req, file, cb) {
    const nameWithoutExt = path.parse(file.originalname).name;
    
    let slugifiedName = slugify(nameWithoutExt, {
      lower: true,
      strict: true,
      locale: 'fr'
    });
  
    const MAX_LENGTH = 100;
    if (slugifiedName.length > MAX_LENGTH) {
      slugifiedName = slugifiedName.substring(0, MAX_LENGTH);
    }
  
    const uniqueName = Date.now() + '-' + slugifiedName + path.extname(file.originalname);
  
    cb(null, uniqueName);
  }
});

// Liste des types MIME autorisés
const allowedMimeTypes = [
  "image/jpeg", "image/png", "image/jpg",
  "audio/mpeg", "audio/wav",
  "video/mp4", "video/quicktime",
  "application/pdf", "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation"
];

// Configuration principale de Multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
  fileFilter: (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Type de fichier non supporté"));
    }
  }
});

// Middleware pour capter proprement les erreurs Multer
function handleMulterErrors(err, req, res, next) {
  if (err instanceof multer.MulterError || err) {
    return res.status(400).json({ message: err.message });
  }
  next();
}

// Fonction pour supprimer un fichier existant
function removeExistingFile(filePath) {
  try {
    const relativePath = filePath.startsWith('http') ? new URL(filePath).pathname : filePath;
    const fullPath = path.join(__dirname, '../../public', relativePath);

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log('Fichier supprimé');
      return true;
    } else {
      console.log('Le fichier n\'existe pas');
      return false;
    }
  } catch (error) {
    console.error('Erreur de suppression:', error);
    return false;
  }
}

module.exports = {
  upload,
  handleMulterErrors,
  removeExistingFile,
  ensureDirectoryExistence
};
