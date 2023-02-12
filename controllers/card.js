const cardSchema = require('../models/card');

module.exports.getCards = (req, res, next) => {
  cardSchema.find({})
    .populate(['owner'])
    .then((card) => res.status(200).send(card))
    .catch(next);
};

module.exports.cancellationDelete = (req, res, next) => {
  cardSchema.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new Error('not found Card');
      } else if (req.user._id !== card.owner._id.toHexString()) {
        throw new Error('not Prava');
      }
      next();
    })
    .catch(next);
};

module.exports.getCardsId = (req, res, next) => {
  cardSchema.findByIdAndRemove(req.params.cardId)
    .populate(['owner'])
    .then((card) => {
      if (!card) {
        throw new Error('not found Card');
      }
      res.status(200).send(card);
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  cardSchema.create({ name, link, owner: req.user._id })
    .then((card) => card.populate('owner'))
    .then((card) => res.status(200).send(card))
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  cardSchema.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        throw new Error('not found Card');
      }
      res.status(200).send(card);
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  cardSchema.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .populate(['owner'])
    .then((card) => {
      if (!card) {
        throw new Error('not found');
      }
      res.status(200).send(card);
    })
    .catch(next);
};
