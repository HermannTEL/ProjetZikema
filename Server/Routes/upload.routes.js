const express = require('express');
const { upload, handleMulterErrors } = require('../Conf/Middlewares/multerConfig');
const { uploadFile, uploadMultipleFiles } = require('../Controllers/upload.controller');

const router = express.Router();

// Single file upload route
router.post('/', upload.single('file'), handleMulterErrors, uploadFile);

// Multiple files upload route
router.post('/multiple', upload.array('files', 10), handleMulterErrors, uploadMultipleFiles);

module.exports = router;
