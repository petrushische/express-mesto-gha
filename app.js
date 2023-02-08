const dotenv = require('dotenv');

dotenv.config();

const express = require('express');

const mongoose = require('mongoose');

const userRouter = require('./routes/userRoutes');

const { login, createUser } = require('./controllers/user');

const cardRouter = require('./routes/cardRoutes');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: '63bc35142fd0106820dc4419',
  };

  next();
});

app.use(userRouter);

app.use(cardRouter);

app.post('/signin', express.json(), login);

app.post('/signup', express.json(), createUser);

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

mongoose.set('strictQuery', false);
mongoose.connect(MONGO_URL, {});
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Успешное плдключение по ${PORT} порту`);
});
