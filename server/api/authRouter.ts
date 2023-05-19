import express from 'express';
// import axios from 'axios';
import { User } from '../database/index';
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });
const router = express.Router();
const SALT_ROUNDS = process.env.SALT_ROUNDS;
const SECRET = process.env.SECRET;
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { zodUser } from '../utils';
import { checkAuthenticated, sameUserOrAdmin } from './authMiddleware';

import passport from 'passport';

export const createZodUser = zodUser
  .strict()
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Password fields do  not match',
      });
    }
  });

router.post('/signup', async (req, res, next) => {
  try {
    const parsedBody = createZodUser.parse(req.body);
    const userEmail = await User.findOne({ email: parsedBody.email });
    if (userEmail)
      return res
        .status(409)
        .send(
          'Cannot signup user with given email- it already exists in the database'
        );

    const newUser = await User.create(parsedBody);

    // must call login method to get access to req.user
    req.login(newUser, (err) => console.log(err));

    res.status(201).json({
      userId: req.user!._id,
      firstName: req.user!.firstName,
      error: { data: null, status: null },
    });
  } catch (err) {
    next(err);
  }
});

router.post(
  '/login',
  passport.authenticate('local', { failureMessage: 'Authentication failed' }),
  (req, res, next) => {
    return res.status(200).json({
      userId: req.user!._id,
      firstName: req.user!.firstName,
      error: { data: null, status: null },
    });
  }
);


router.post('/check-email', async (req, res, next) => {
  try {
    const emailLookup = await User.findOne({ email: req.body.email });
    if (!emailLookup) return res.status(200).json({ message: false });

    res.status(200).json({ message: true });
  } catch (err) {
    next(err);
  }
});



router.post('/logout', (req, res, next) => {
  if (!req.user)
    return res.status(400).json({ message: 'not logged in to begin with...' });

  req.logout((err) => {
    if (!err) return res.sendStatus(204);
    return next(err);
  });
});


router.get('/get-user-id', checkAuthenticated, async (req, res, next) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(404).send('No user ID found');

    res.status(200).json({userId});
  } catch (err) {
    next(err);
  }
});

export default router;
