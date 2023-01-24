const express = require('express');

const router = require('express').Router();

const { createCard } = require('../controllers/card');

router.post('/cards', express.json(), createCard);

module.exports = router;
