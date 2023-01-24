const express = require('express');

const router = require('express').Router();

const { createCard, getCardsId, getCards } = require('../controllers/card');

router.get('/cards', getCards);

router.get('/cards/:cardId', getCardsId);

router.post('/cards', express.json(), createCard);

module.exports = router;
