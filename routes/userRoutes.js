const express = require('express');

// eslint-disable-next-line import/no-extraneous-dependencies
const { celebrate, Joi } = require('celebrate');

const router = require('express').Router();

const {
  getUsers, getUsersId, updateUserInfo, updateUserAvatar, usersMe,
} = require('../controllers/user');

router.get('/users', getUsers);

router.get('/users/me', usersMe);

router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}), getUsersId);

router.patch('/users/me', express.json(), celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUserInfo);

router.patch('/users/me/avatar', express.json(), celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*/),
  }),
}), updateUserAvatar);

module.exports = router;
