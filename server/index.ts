import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import apiRouter from './api/apiRouter';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import bcrypt from 'bcrypt';
import { Strategy as LocalStrategy } from 'passport-local';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { User } from './database/index';
import mongoInit from './database/dbStartup';

// for passport testing
import {
  checkAuthenticated,
  requireAdmin,
  sameUserOrAdmin,
} from './api/authMiddleware';

import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

const PORT = process.env.PORT || 3002;
const MONGO_DB_URL = process.env.MONGO_DB_URL;
const CLIENT_URL = process.env.CLIENT_URL;

const app = express();

// set up session middleware w/ mongo store
// const sessionStore =

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(cors({ origin: CLIENT_URL, credentials: true }));
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
      maxAge: 1000 * 60 * 60 * 12,
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
  '/test-secure/:userId',
  checkAuthenticated,
  sameUserOrAdmin,
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
    return res.status(400).json({ message: validationError.message });
  }
  next(err);
});

app.listen(PORT, async () => {
  await mongoInit();
  User.purgeInactiveCart();
  setInterval(() => {
    console.log('Purging stale carts...');
    User.purgeInactiveCart();
  }, 1000 * 60 * 60 * 24 * 2);
  console.log('Server is listening on port: ' + PORT);
});
