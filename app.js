const dotenv = require('dotenv');

dotenv.config();

const express = require('express');

const mongoose = require('mongoose');

const auth = require('./middlewares/auth');

const userRouter = require('./routes/userRoutes');

const cardRouter = require('./routes/cardRoutes');

const { login, createUser } = require('./controllers/user');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();

app.post('/signin', express.json(), login); // вход

app.post('/signup', express.json(), createUser); // авторизация

app.use(auth, userRouter);

app.use(auth, cardRouter);

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

mongoose.set('strictQuery', false);
mongoose.connect(MONGO_URL, {});
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Успешное подключение по ${PORT} порту`);
});
