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

mongoose.set('strictQuery', false);
mongoose.connect(MONGO_URL, {});
app.listen(PORT);
