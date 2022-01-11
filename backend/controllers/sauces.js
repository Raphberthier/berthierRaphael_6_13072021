const fs = require('fs'); //application pour modifier système de fichiers

const Sauce = require('../models/sauce');

/*POST /api/sauces Création sauce*/
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject, //L'opérateur spread ... est utilisé pour faire une copie de tous les éléments de req.body
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, 
        likes: 0, 
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce créé'}))
        .catch(error => res.status(400).json({ error }));
};
