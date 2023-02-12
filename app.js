const dotenv = require('dotenv');

dotenv.config();

const express = require('express');

const mongoose = require('mongoose');

const auth = require('./middlewares/auth');

const userRouter = require('./routes/userRoutes');

const cardRouter = require('./routes/cardRoutes');

const { login, createUser, cancelCreateUser } = require('./controllers/user');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();

app.post('/signin', express.json(), login); // вход

app.post('/signup', express.json(), cancelCreateUser); // проверка email

app.post('/signup', express.json(), createUser); // авторизация

app.use(auth, userRouter);

app.use(auth, cardRouter);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.name === 'CastError') {
    res.status(400).send({ message: 'Неверный адрес, проверьте и введите еще раз' });
  } else if (err.name === 'ValidationError') {
    res.status(400).send({ message: 'Ошибка валидации полей' });
  } else if (err.message === 'not found') {
    res.status(404).send({ message: 'Такого пользователя не существует' });
  } else if (err.message === 'not found Card') {
    res.status(404).send({ message: 'Такой карточки не существует' });
  } else if (err.message === 'Неправильные почта или пароль') {
    res.status(401).send({ message: err.message });
  } else if (err.message === 'Такой пользователь уже существует') {
    res.status(409).send({ message: err.message });
  } else if (err.message === 'not Prava') {
    res.send({ message: 'Вы не можете удалить эту карточку, так как не являетесь её создателем' });
  } else if (err.message === 'Необходима авторизация') {
    res.status(401).send({ message: err.message });
  } else {
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
});

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

mongoose.set('strictQuery', false);
mongoose.connect(MONGO_URL, {});
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Успешное подключение по ${PORT} порту`);
});
