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
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      SECRET!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    );

    if (!token) return res.status(500).send('Secret is broken');
    res.status(201).json({ newUser, token });
  } catch (err) {
    next(err);
  }
});

router.post('/check-email', async (req, res, next) => {
  try {
    const email = req.body;
    const emailLookup = await User.findOne({ email: req.body.email });
    if (!emailLookup) return res.status(200).json({ message: false });

    res.status(200).json({ message: true });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userLookup = await User.findOne({ email });
    if (!userLookup)
      return res.status(404).send('Cannot find user withn given email');
    const comparePass = await bcrypt.compare(password, userLookup.password);
    if (!comparePass)
      return res.status(403).send('Password does not match database records');

    const token = jwt.sign(
      { id: userLookup._id, role: userLookup.role },
      SECRET!
    );
    // console.log('loginTOKEN', userLookup.id);
    if (!token) return res.status(500).send('Secret is broken');

    res.status(200).json({ token, userId: userLookup._id });
  } catch (err) {
    next(err);
  }
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

// router.get('/login', async (req, res, next) => {
//   try {
//     const { data } = await axios.post(
//       'https://dev-z5aj5eewyq3duaqc.us.auth0.com/oauth/token',
//       {
//         client_id: 'eW7bfGKjfMoKlIVRiuev2ehC7Boy5XUd',
//         client_secret:
//           'REDgfT-NsYPiVXrj4kfx4eYw5F0BjaSbpovRfYwK5caX_eVb4_5LwVbqxH-MEiio',
//         audience: 'e-comPB',
//         grant_type: 'client_credentials',
//       },
//       { headers: { 'content-type': 'application/json' } }
//     );

//     res.status(200).json(data);
//   } catch (err) {
//     next(err);
//   }
// });

// router.get('/login', async (req, res, next) => {
//   try {
//     const { data } = await axios.post(
//       'https://dev-3nurd80vhso7rxtr.us.auth0.com/oauth/token',
//       {
//         client_id: 'vrf63x8WdTTChYHTEcdP6n79ciqpxPK8',
//         client_secret:
//           'h_HW63aY0BsKtZasU3Yoju_AXp4NBldAksQ3Lh-q5Kcl2z7sQah1XRbVfBXiwjGo',
//         audience: 'e-com',
//         grant_type: 'client_credentials',
//       },
//       { headers: { 'content-type': 'application/json' } }
//     );

//     res.status(200).json(data);
//   } catch (err) {
//     next(err);
//   }
// });

// export default router;
