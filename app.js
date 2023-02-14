const dotenv = require('dotenv');

dotenv.config();

// eslint-disable-next-line import/no-extraneous-dependencies
const { errors, celebrate, Joi } = require('celebrate');

const express = require('express');

const mongoose = require('mongoose');

const NotFoundError = require('./errors/NotFoundError');

const auth = require('./middlewares/auth');

const userRouter = require('./routes/userRoutes');

const cardRouter = require('./routes/cardRoutes');

const { login, createUser } = require('./controllers/user');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();

app.post('/signin', express.json(), celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login); // авторизация

app.post('/signup', express.json(), celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*/),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), createUser); // создание пользователя

app.use(auth, userRouter);

app.use(auth, cardRouter);

// eslint-disable-next-line no-unused-vars
app.use('*', auth, (req, res) => {
  throw new NotFoundError('page not found');
});

app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.statusCode === 400) {
    res.status(err.statusCode).send({ message: err.message });
  } else if (err.message === 'not found') {
    res.status(err.statusCode).send({ message: 'Такого пользователя не существует' });
  } else if (err.message === 'not found Card') {
    res.status(err.statusCode).send({ message: 'Такой карточки не существует' });
  } else if (err.message === 'Неправильные почта или пароль') {
    res.status(err.statusCode).send({ message: err.message });
  } else if (err.message === 'Вы не можете удалить эту карточку') {
    res.status(err.statusCode).send({ message: 'Вы не можете удалить эту карточку, так как не являетесь её создателем' });
  } else if (err.message === 'Пользователь с таким email уже существует') {
    res.status(err.statusCode).send({ message: 'Пользователь с таким email уже существует' });
  } else if (err.message === 'Необходима авторизация') {
    res.status(err.statusCode).send({ message: err.message });
  } else if (err.message === 'page not found') {
    res.status(err.statusCode).send({ message: 'Страница не найдена' });
  } else {
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
});

mongoose.set('strictQuery', false);
mongoose.connect(MONGO_URL, {});
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Успешное подключение по ${PORT} порту`);
});
