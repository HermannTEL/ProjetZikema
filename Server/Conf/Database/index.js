require('dotenv').config({path: '../../../Server.env'});

// ici on va connecter à la base de donnée
const mongoUri = process.env.MONGO_URI;
console.log("📦 ENV Loaded MONGO_URI =", mongoUri);

module.exports = { mongoUri };
