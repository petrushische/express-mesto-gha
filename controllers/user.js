// eslint-disable-next-line import/no-extraneous-dependencies
const bcryptjs = require('bcryptjs');

// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');

const userSchema = require('../models/user');

module.exports.getUsers = (req, res, next) => {
  userSchema.find({})
    .then((user) => res.status(200).send(user))
    .catch(next);
};

module.exports.getUsersId = (req, res, next) => {
  userSchema.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new Error('not found');
      }
      res.status(200).send(user);
    })
    .catch(next);
};

// eslint-disable-next-line no-unused-vars
module.exports.cancelCreateUser = (req, res, next) => {
  const {
    email,
  } = req.body;
  userSchema.findOne({ email })
    .then((user) => {
      if (!user) {
        next();
      } else if (user.email === email) {
        throw new Error('Такой пользователь уже существует');
      }
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcryptjs.hash(password, 10)
    .then((hash) => {
      userSchema.create({
        name, about, avatar, email, password: hash,
      })
        .then((user) => res.status(200).send(user))
        .catch(next);
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  userSchema.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        throw new Error('not found');
      }
      res.status(200).send(user);
    })
    .catch(next);
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  userSchema.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        throw new Error('not found');
      }
      res.status(200).send(user);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return userSchema.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'secret', { expiresIn: '7d' });

      res.send({ token });
    })
    .catch(next);
};

module.exports.usersMe = (req, res, next) => {
  userSchema.findById(req.user._id)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};
