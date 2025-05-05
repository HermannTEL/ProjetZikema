// Packages NPM
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const route = require('./routes/message.routes')
const dotenv = require('dotenv');

dotenv.config();

// Modules natifs
const path = require("path");

// Modules locaux
// Connect to MongoDB
const db = require('../../Conf/Database').mongoUri;
console.log(db);
mongoose.connect(db)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(err));

const app = express();

app.use(morgan("short"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/messages', route);

app.use(express.static(path.join(__dirname, "public")));


app.listen((PORT = 5006), () =>
    console.log(`Server is on http://localhost:${PORT}`)
);

