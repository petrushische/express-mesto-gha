const express = require('express');

const router = require('express').Router();

const { createUser, getUsers, getUsersId } = require('../controllers/user');

router.get('/users', getUsers);

router.get('/users/:userId', getUsersId);

router.post('/users', express.json(), createUser);

module.exports = router;
