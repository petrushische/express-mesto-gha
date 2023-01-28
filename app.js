const express = require('express');

const mongoose = require('mongoose');

const userRouter = require('./routes/userRoutes');

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

async function connect() {
  mongoose.set('strictQuery', false);
  await mongoose.connect(MONGO_URL, {});
  console.log(`Подключились к MongoDB ${MONGO_URL}`);
  await app.listen(PORT);
  console.log(`Успешное подключение, порт ${PORT}`);
}

connect();
