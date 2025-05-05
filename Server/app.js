//importation des dépendances
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const route = require("./Routes");
const uploadRoutes = require('./Routes/upload.routes');
const stripeWebhook = require("./Routes/stripewebhook.route");

require("dotenv").config();

//connexion de la bd
const db = require("./Conf/Database").mongoUri
console.log(db);
mongoose.connect(db).then(() => {
    console.log("Vous êtes connectés à la base de donnée");
}).catch((error) => {
    console.log(error)
})

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/api/Zikema", route);  // Point d'entrée
app.use('/api/Zikema/uploads', uploadRoutes);// Point d'entrée pour les fichiers uploadés
app.use("/api/Zikema/stripe", stripeWebhook); // Point d'entrée stripe web hook

//parametrage du serveur
app.listen((port = 5000), () => {
    console.log(`Le serveur écoute au http://localost:${port}`)
});


