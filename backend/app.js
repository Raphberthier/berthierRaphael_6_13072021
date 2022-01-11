const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();

app.use(express.json());

const mongoose = require('mongoose');

/* Connexion à la base de donnée MongoDB */

mongoose.connect('mongodb+srv://raph:Marseille95@cluster0.5c2jz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  /* Middleware CORS - Ajout de headers à l'objet "response" */

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  
/* Package body-parser - Extraire l'objet JSON de la demande */
  app.use(bodyParser.json());

/* Enregistrement des routes dans l'application */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const path = require('path');
app.use('/images', express.static(path.join(__dirname, 'images')));


const saucesRoutes = require('./routes/sauces');
app.use('/api/sauces', saucesRoutes);

const userRoutes = require('./routes/user');
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);
  module.exports = app;
  