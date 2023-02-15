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
  } else if (err.statusCode === 404) {
    res.status(err.statusCode).send({ message: err.message });
  } else if (err.statusCode === 401) {
    res.status(err.statusCode).send({ message: err.message });
  } else if (err.statusCode === 403) {
    res.status(err.statusCode).send({ message: err.message });
  } else if (err.statusCode === 409) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    const { statusCode = 500 } = err;
    const message = 'Ошибка на стороне сервера';
    res.status(statusCode).send({ message });
  }
});

mongoose.set('strictQuery', false);
mongoose.connect(MONGO_URL, {});
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Успешное подключение по ${PORT} порту`);
});
