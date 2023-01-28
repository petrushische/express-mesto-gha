const userSchema = require('../models/user');

module.exports.getUsers = (req, res) => {
  userSchema.find({})
    .then((user) => res.status(200).send(user))
    .catch((err) => res.status(500).send({ message: err.message }));
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
        res.status(500).send({ message: 'Произошла неизвестная ошибка, проверьте правильность запроса' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  userSchema.create({ name, about, avatar })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Ошибка валидации полей', ...err });
      } else {
        res.status(500).send({ message: 'Произошла неизвестная ошибка, проверьте правильность запроса' });
      }
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
        res.status(500).send({ message: 'Произошла неизвестная ошибка, проверьте правильность запроса' });
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
        res.status(500).send({ message: 'Произошла неизвестная ошибка, проверьте правильность запроса' });
      }
    });
};
