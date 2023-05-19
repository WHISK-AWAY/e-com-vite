import express, { NextFunction, Application, Response, Request } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './api/apiRouter';
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import bcrypt from 'bcrypt';
import { Strategy as LocalStrategy } from 'passport-local';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { IUser, User } from './database/index';
import mongoInit from './database/dbStartup';
import { checkAuthenticated, requireAdmin } from './api/authMiddleware';

dotenv.config({ path: '../.env' });
const PORT = process.env.PORT || 3002;
const MONGO_DB_URL = process.env.MONGO_DB_URL;

const app = express();

// set up session middleware w/ mongo store
// const sessionStore =

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(passport.initialize());
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET!,
    cookie: {
      signed: true,
      httpOnly: true,
      // sameSite: false,
      maxAge: 1000 * 60 * 30,
    },
    store: MongoStore.create({
      mongoUrl: MONGO_DB_URL,
      // collectionName: 'sessions', // using default
    }),
  })
);
app.use(passport.session());

// const mongoConnection = (async () => await mongoInit())();

/**
 * * PASSPORT SETUP
 */

passport.use(
  new LocalStrategy(
    { usernameField: 'email', session: true },
    async function verify(email, password, done) {
      // find user by email
      // compare password
      // return user object or false

      try {
        const user = await User.findOne({ email });

        if (!user) return done(null, false, { message: 'Invalid email' });

        if (await bcrypt.compare(password, user.password)) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Wrong password' });
        }
      } catch (err) {
        console.log('error in password verification', err);
        return done(err);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    if (!user) throw new Error('No user found during deserialize step -- ??');
    return done(null, user);
  } catch (err) {
    console.log('error in deserializeUser');
    return done(err);
  }
});

/**
 * * PASSPORT TEST ROUTES
 */

app.get(
  '/test-secure',
  checkAuthenticated,
  requireAdmin,
  async (req, res, next) => {
    console.log('cookie @ test secure:', req.session.cookie);
    console.log('sid @ test secure:', req.session.id);
    console.log('user @ test secure:', req.user);
    console.log('isAuthenticated@test-secure', req.isAuthenticated());
    if (req.user) {
      res.json({ message: 'welcome' });
    } else {
      res.json({ message: 'gtfo' });
    }
  }
);

/**
 * * ROUTES
 */
app.use('/api', apiRouter);

app.get('/', (req, res, next) => {
  try {
    res.status(200).send('homepage');
  } catch (err) {
    next(err);
  }
});

// pretty much just for testing - this is set on an interval during mongo startup
app.patch('/purge-inactive-cart', async (req, res, next) => {
  try {
    await User.purgeInactiveCart();
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

app.listen(PORT, async () => {
  await mongoInit();
  console.log('Server is listening on port: ' + PORT);
});
