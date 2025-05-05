const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");
require('dotenv').config()

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = process.env.JWT_EXPIRES;

console.log("Auth Controller Loaded");

// S'inscrire
exports.register = async (req, res) => {
  try {
    const { email, password, confirmPassword, firstname, lastname, phone, bio, address, role, instruments, expertise, availability } = req.body;

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Cet email est déjà utilisé" });
    }

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const cleanPassword = password.trim();
    const hashedPassword = await bcrypt.hash(cleanPassword, salt);

    // Image Handling
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

    // Créer uniquement les bons champs
    const newUser = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      confirmPassword,
      phone,
      bio,
      address,
      instruments,
      expertise,
      availability,
      imageUrl,
      isActive: true,
      role: role || "student",
      createdAt: Date.now()
    });

    const user = await newUser.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES
    });

    user.password = undefined;

    res.status(201).json({
      success: true,
      token,
      data: user
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Erreur lors de la création", error: error.message });
  }
};


// Se connecter
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Données envoyées à l'API:", { email, password });

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Veuillez fournir un email et un mot de passe' });
    }

    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({ success: false, message: "Cet utilisateur n'existe pas !" });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Compte désactivé. Contactez l\'administration.' });
    }

    const cleanPassword = password.trim();
    const isMatch = await bcrypt.compare(cleanPassword, user.password);

    console.log({
      password_saisi: password,
      password_saisi_length: password.length,
      password_saisi_bytes: Buffer.from(password).toString('hex'),
      password_db: user.password,
      password_db_length: user.password.length,
      password_db_bytes: Buffer.from(user.password).toString('hex'),
    });
    

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Mot de passe incorrect.' });
    }

    user.lastLogin = Date.now();
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES
    });

    user.password = undefined;

    res.status(200).json({ success: true, token, data: user });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

