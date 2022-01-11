const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');//identification
const multer = require('../middleware/multer-config');//images

const sauceCtrl = require('../controllers/sauces');


router.post("/", auth, multer, sauceCtrl.createSauce);
router.get('/', auth, sauceCtrl.getAllSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.likeSauce);



module.exports = router;