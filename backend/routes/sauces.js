const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');//identification
const multer = require('../middleware/multer-config');//images

const saucesCtrl = require('../controllers/sauces');


router.post('/', auth, multer, saucesCtrl.createSauce);


module.exports = router;