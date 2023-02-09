const express = require('express');

const router = require('express').Router();

const {
  getUsers, getUsersId, updateUserInfo, updateUserAvatar, usersMe,
} = require('../controllers/user');

router.get('/users', getUsers);

router.get('/users/me', usersMe);

router.get('/users/:userId', getUsersId);

router.patch('/users/me', express.json(), updateUserInfo);

router.patch('/users/me/avatar', express.json(), updateUserAvatar);

module.exports = router;
