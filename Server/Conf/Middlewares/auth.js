const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const auth = (roles = []) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Non autorisé" });

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    
      console.log("Decoded token:", decoded); // 👈 Ajoute ceci
      console.log("Authorized roles for this route:", roles); // 👈 Ajoute ceci
    
      if (roles.length && !roles.some(role => decoded.role === role)) {
        return res.status(403).json({ message: "Accès refusé" });
      }
      next();
    }
      catch (err) {
      return res.status(401).json({ message: "Token invalide" });
    }
  };
};

const generateToken = (user) => {
  if (!user || !user._id || !user.role) {
    throw new Error("Informations utilisateur incomplètes pour la génération du token");
  }

  const payload = {
    id: user._id,
    role: user.role,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" }); // Durée de vie 1h
}

module.exports = { 
  auth,
  generateToken,
};
