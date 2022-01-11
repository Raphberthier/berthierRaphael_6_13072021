const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

const passwords = require('../middleware/passwords');


/* Séparation de la logique métier des routes en contrôleurs */
router.post('/signup', passwords, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;