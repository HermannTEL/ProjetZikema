const express = require("express");
const router = express.Router();
const AuthController = require("../Controllers/auth.controller");
const {upload, handleMulterErrors} = require('../Conf/Middlewares/multerConfig')

router.post("/register", upload.single('profileImage'), handleMulterErrors, AuthController.register);
router.post("/login", AuthController.login);

module.exports = router;
