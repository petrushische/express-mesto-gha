const cardSchema = require('../models/card');

module.exports.getCards = (req, res) => {
  cardSchema.find({})
    .populate(['owner'])
    .then((card) => res.status(200).send(card))
    // eslint-disable-next-line no-unused-vars
    .catch((err) => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

// eslint-disable-next-line no-unused-vars
module.exports.cancellationDelete = (req, res, next) => {
  cardSchema.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new Error('not found');
      } else if (req.user._id !== card.owner._id.toHexString()) {
        throw new Error('not Prava');
      }
      next();
    })
    .catch((err) => {
      if (err.message === 'not found') {
        res.status(404).send({ message: 'Такой карточки не существует' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Неверный id, проверьте и введите еще раз' });
      } else if (err.message === 'not Prava') {
        res.send({ message: 'Вы не можете удалить эту карточку, так как не являетесь её создателем' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.getCardsId = (req, res) => {
  cardSchema.findByIdAndRemove(req.params.cardId)
    .populate(['owner'])
    .then((card) => {
      if (!card) {
        throw new Error('not found');
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Неверный id, проверьте и введите еще раз' });
      } else if (err.message === 'not found') {
        res.status(404).send({ message: 'Такй карточки не существует' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  cardSchema.create({ name, link, owner: req.user._id })
    .then((card) => card.populate('owner'))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Ошибка валидации полей', ...err });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  cardSchema.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        throw new Error('not found');
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Неверный id, проверьте и введите еще раз' });
      } else if (err.message === 'not found') {
        res.status(404).send({ message: 'Такого пользователя не существует' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
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
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Неверный id, проверьте и введите еще раз' });
      } else if (err.message === 'not found') {
        res.status(404).send({ message: 'Такого пользователя не существует' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
