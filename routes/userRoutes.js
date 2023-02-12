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
    userId: Joi.string().alphanum().length(24),
  }),
}), getUsersId);

router.patch('/users/me', express.json(), celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUserInfo);

router.patch('/users/me/avatar', express.json(), celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().min(2),
  }),
}), updateUserAvatar);

module.exports = router;
