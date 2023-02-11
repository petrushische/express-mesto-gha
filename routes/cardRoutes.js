const express = require('express');

const router = require('express').Router();

const {
  createCard, getCardsId, getCards, likeCard, dislikeCard, cancellationDelete,
} = require('../controllers/card');

router.get('/cards', getCards);

router.delete('/cards/:cardId', cancellationDelete);

router.delete('/cards/:cardId', getCardsId);

router.post('/cards', express.json(), createCard);

router.put('/cards/:cardId/likes', likeCard);

router.delete('/cards/:cardId/likes', dislikeCard);

module.exports = router;
