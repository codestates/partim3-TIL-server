import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import authRouter from './routes/auth';
import calendarRouter from './routes/calendar';

import dbConnection from './utils/typeormConnection';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if (process.env.NODE_ENV === 'development') {
  dotenv.config({
    path: `./env/development.env`,
  });
  app.use(morgan('dev'));
  app.use(
    cors({
      origin: ['http://localhost:3000'],
      credentials: true,
    })
  );
}

if (process.env.NODE_ENV === 'production') {
  dotenv.config({
    path: `./env/production.env`,
  });
  app.use(
    cors({
      origin: ['http://localhost:3000'],
      credentials: true,
    })
  );
}

void dbConnection.connection();

app.use('/users', authRouter);
app.use('/calendar', calendarRouter);

export default app;
