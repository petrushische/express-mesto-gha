const cardSchema = require('../models/card');

const NotFoundError = require('../errors/NotFoundError');

const BadRequestError = require('../errors/BadRequestError');

const DeleteError = require('../errors/DeleteError');

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
        throw new NotFoundError('not found Card');
      } else if (req.user._id !== card.owner._id.toHexString()) {
        throw new DeleteError('Вы не можете удалить эту карточку так как не являетесь её создателем');
      }
      next();
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.getCardsId = (req, res, next) => {
  cardSchema.findByIdAndRemove(req.params.cardId)
    .populate(['owner'])
    .then((card) => {
      if (!card) {
        throw new NotFoundError('not found Card');
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
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Ошибка валидации'));
      } else {
        next(err);
      }
    });
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
        throw new NotFoundError('not found Card');
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
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
        throw new NotFoundError('not found Card');
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};
