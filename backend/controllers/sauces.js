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

// gestion des likes
exports.likeSauce = (req, res, next) => {
  const like = req.body.like;
  switch (like) {
    //l'utilisateur aime : on ajoute son id au tableau et on incrémente les likes
    case 1:
      Sauce.updateOne({ _id: req.params.id }, {
        $inc: { likes: +1 },
        $push: { usersLiked: req.body.userId }
      })
        .then(() => res.status(201).json({ message: "J'aime ajouté" }))
        .catch(error => res.status(500).json({ error }))
      break;

    //l'utilisateur n'aime pas : on ajoute son id au tableau et on incrémente les likes
    case -1:
      Sauce.updateOne({ _id: req.params.id }, {
        $push: { usersDisliked: req.body.userId }, $inc: { dislikes: +1 }
      })
        .then(() => res.status(201).json({ message: "je n'aime pas ajouté" }))
        .catch(error => res.status(500).json({ error }))
      break;

    //l'utilisateur annule son choix : on retire l'utilisateur du tableau et on désincrémente les likes ou dislikes suivant le tableau dans lequel il se trouvait
    case 0:
      Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
          if (sauce.usersLiked.includes(req.body.userId)) {
            Sauce.updateOne({ _id: req.params.id }, {
              $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 }
            })
              .then(() => res.status(201).json({ message: "j'aime a été retiré !" }))
              .catch(error => res.status(500).json({ error }))
          }
          else {
            Sauce.updateOne({ _id: req.params.id }, {
              $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 }
            })
              .then(() => res.status(201).json({ message: "je n'aime pas été retiré !" }))
              .catch(error => res.status(500).json({ error }))
          }

        })
        .catch(error => res.status(500).json({ error }))
      break;

    default: console.log(req.body)
  }
};