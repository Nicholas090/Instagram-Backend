require('dotenv').config();
import cors from 'cors';
var cookieParser = require('cookie-parser');
import mongoose from 'mongoose';
import { Express } from 'express';
import router from './router';
import express from 'express';
import errormiddleware from './middlewares/error.middleware';

const app: Express = express();

const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/api', router);
app.use(errormiddleware);

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL as string);
    app.listen(PORT, () => console.log('Сервер запущен'));
  } catch (e) {
    console.log(e);
  }
};

start();
