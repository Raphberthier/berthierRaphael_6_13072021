const Sauce = require('../models/Sauce');
const fs = require('fs');


exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce sauvegardée' }))
    .catch(error => res.status(400).json({error: error }));
};
//modifie la sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? { 
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : {...req.body}

  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifié !'}))
    .catch(error => res.status(400).json({ error }));
};
// Supprimer sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

// récuperer toutes les sauces
exports.getAllSauce = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};
// récuperer une sauces
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

// Gérer les likes
exports.likeSauce = (req, res, next) => {
  etatLike = req.body.like;
  //Si like = 1 on incrémente le like de la sauce et on ajoute l'ID du user dans le tableau
  if(etatLike === 1){
      Sauce.updateOne({ _id: req.params.id } ,{ $inc: { likes: 1 }, $push: { usersLiked: req.body.userId }})
          .then( () => res.status(200).json({ message: 'Like ajouté !' }))
          .catch(error => res.status(400).json({ error }));
    //Si like = -1 on incrémente le dislike de la sauce et on ajoute l'ID du user dans le tableau        
  }else if(etatLike === -1){
      Sauce.updateOne({ _id: req.params.id } ,{ $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId }})
          .then( () => res.status(200).json({ message: 'Dislike ajouté !' }))
          .catch(error => res.status(400).json({ error }));
  // On regarde les deux tableaux
  }else{
      Sauce.findOne({ _id: req.params.id })
          .then(sauce => {
              //Enlève l'attribut like et supprime l'user du tableau
              if (sauce.usersLiked.includes(req.body.userId)) {
                  Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId } })
                      .then(() => { res.status(200).json({ message: 'Like supprimé !' }) })
                      .catch(error => res.status(400).json({ error }))
              } else if (sauce.usersDisliked.includes(req.body.userId)) {
                  //Enlève l'attribut dislike et supprime l'user du tableau
                  Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId } })
                      .then(() => { res.status(200).json({ message: 'Dislike supprimé !' }) })
                      .catch(error => res.status(400).json({ error }))
              }
          })
          .catch(error => res.status(400).json({ error }))
  }

}