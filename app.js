const express = require('express');

const mongoose = require('mongoose');

const router = require('./routes/userRoutes');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();

app.use(router);

async function connect() {
  mongoose.set('strictQuery', false);
  await mongoose.connect(MONGO_URL, {});
  console.log(`Подключились к MongoDB ${MONGO_URL}`);
  await app.listen(PORT);
  console.log(`Успешное подключение, порт ${PORT}`);
}

connect();
