// eslint-disable-next-line import/no-extraneous-dependencies
const bcryptjs = require('bcryptjs');

// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');

const userSchema = require('../models/user');

module.exports.getUsers = (req, res) => {
  userSchema.find({})
    .then((user) => res.status(200).send(user))
    // eslint-disable-next-line no-unused-vars
    .catch((err) => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.getUsersId = (req, res) => {
  userSchema.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new Error('not found');
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.message === 'not found') {
        res.status(404).send({ message: 'Такого пользователя не существует' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Неверный id, проверьте и введите еще раз' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcryptjs.hash(password, 10)
    .then((hash) => {
      userSchema.create({
        name, about, avatar, email, password: hash,
      })
        .then((user) => res.status(200).send(user))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            res.status(400).send({ message: 'Ошибка валидации полей', ...err });
          } else {
            res.status(500).send({ message: 'На сервере произошла ошибка' });
          }
        })
        .catch((err) => {
          res.status(400).send(err);
        });
    });
};

module.exports.updateUserInfo = (req, res) => {
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
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Ошибка валидации полей', ...err });
      } else if (err.message === 'not found') {
        res.status(404).send({ message: 'Такого пользователя не существует' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
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
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Ошибка валидации полей', ...err });
      } else if (err.message === 'not found') {
        res.status(404).send({ message: 'Такого пользователя не существует' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return userSchema.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'secret', { expiresIn: '7d' });

      res.send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

module.exports.usersMe = (req, res) => {
  userSchema.findById(req.user._id)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Неверный адресс' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
