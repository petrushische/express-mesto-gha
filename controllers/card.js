const cardSchema = require('../models/card');

module.exports.getCards = (req, res) => {
  cardSchema.find({})
    .populate(['owner'])
    .then((card) => res.status(200).send(card))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.getCardsId = (req, res) => {
  cardSchema.findById(req.params.cardId)
    .populate(['owner'])
    .then((card) => { res.status(200).send(card); })
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  cardSchema.create({ name, link, owner: req.user._id })
    .then((card) => card.populate('owner'))
    .then((card) => res.status(200).send(card))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.likeCard = (req, res) => {
  cardSchema.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => res.status(200).send(card))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.dislikeCard = (req, res) => {
  cardSchema.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .populate(['owner'])
    .then((card) => res.status(200).send(card))
    .catch((err) => res.status(500).send({ message: err.message }));
};
