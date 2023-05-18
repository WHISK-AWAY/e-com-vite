import express, { NextFunction, Application, Response, Request } from 'express';
import cookieParser from 'cookie-parser';

import passport from 'passport';
import { initialize as initializePassport } from './passport/passportConfig';

initializePassport(
  passport,
  async (email) => {
    console.log('getUserByEmail()');
    const user = await User.findOne({ email });
    // console.log('user @ getUserByEmail():', user);
    return user;
  },
  async (id) => await User.findById(id)
);
import flash from 'express-flash';
import session from 'express-session';

import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { User } from './database/index';
import apiRouter from './api/apiRouter';
dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 3002;
const MONGO_DB_URL = process.env.MONGO_DB_URL;

const init = async () => {
  if (!MONGO_DB_URL)
    throw new Error(
      'Failed to connect to MongoDB. Double-check that MONGO_DB_URL is defined as an environment variable, and that mongod is running.'
    );
  await mongoose.connect(MONGO_DB_URL);
  console.log('connected to MongoDB @', MONGO_DB_URL);

  const msPerDay = 1000 * 60 * 60 * 24;
  setInterval(() => {
    User.purgeInactiveCart();
  }, msPerDay);
};

app.use(morgan('dev'));
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser(process.env.SESSION_SECRET!));

/**
 * * Passport setup
 */

initializePassport(
  passport,
  async (email) => {
    console.log('getUserByEmail()');
    const user = await User.findOne({ email });
    // console.log('user @ getUserByEmail():', user);
    return user;
  },
  async (id) => await User.findById(id)
);
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get('/test-login', (req, res, next) => {
  res.send('Try logging in...');
});

app.post(
  '/test-login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/test-login',
    failureFlash: true,
  })
);

app.use('/api', apiRouter);

app.get('/', (req, res, next) => {
  try {
    res.status(200).send('homepage');
  } catch (err) {
    next(err);
  }
});

app.patch('/purge-inactive-cart', async (req, res, next) => {
  try {
    const purgeCart = await User.purgeInactiveCart();
    res.status(204).send('ok');
  } catch (err) {
    next(err);
  }
});

app.use('*', (req, res, next) => {
  res.status(404).send('Route does not exist');
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ZodError) {
    console.error(err);
    const validationError = fromZodError(err);
    return res.status(400).send(validationError.message);
  }
  next(err);
});

app.listen(PORT, () => {
  init();
  console.log('Server is listening on port: ' + PORT);
});
