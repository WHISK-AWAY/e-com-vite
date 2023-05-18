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
import { checkAuthenticated, checkNotAuthenticated } from './authMiddleware';
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

router.post('/signup', checkNotAuthenticated, async (req, res, next) => {
  try {
    const parsedBody = createZodUser.parse(req.body);
    // delete parsedBody.confirmPassword;
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

// TODO: error handling for duplicate user

router.post('/test-signup', checkNotAuthenticated, async (req, res, next) => {
  try {
    const parsedBody = createZodUser.parse(req.body);
    // delete parsedBody.confirmPassword;
    const newUser = await User.create(parsedBody);

    await req.login(newUser, (err) => {
      if (err) return next(err);
    });

    // console.log('req.user:', req.user);

    res.status(201).json({
      firstName: req.user!.firstName,
      userId: req.user!._id,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/test-login', passport.authenticate('local'), (req, res, next) => {
  console.log('post test-login');
  console.log('Role:', req.user.role);
  console.log('res header', res.getHeaders());
  console.log('req headers', req.headers);
  res.json({
    firstName: req.user.firstName,
    userId: req.user._id,
    help: 'help',
  });
});

// router.post('/login', async (req, res, next) => {
//   await appPassport.authenticate('local', ());
//   console.log('req.user:', req.user);
//   console.log('authenticated?', req.isAuthenticated());
//   return res.json(req.user);
//   // appPassport.authenticate('local', (err: any, user: any, info: any) => {
//   //   if (err) throw err;
//   //   if (!user) return res.send('passport authentication failed: no user');
//   //   else {
//   //     req.logIn(user, (err) => {
//   //       if (err) throw err;
//   //       console.log('req user:', req.user);
//   //       return res.send('passport auth successful');
//   //     });
//   //   }
//   // });
// });

// router.post('/login', async (req, res, next) => {
//   try {
//     const { email, password } = req.body;
//     const userLookup = await User.findOne({ email });
//     if (!userLookup)
//       return res.status(404).send('Cannot find user withn given email');
//     const comparePass = await bcrypt.compare(password, userLookup.password);
//     if (!comparePass)
//       return res.status(403).send('Password does not match database records');

//     const token = jwt.sign(
//       { id: userLookup._id, role: userLookup.role },
//       SECRET!
//     );
//     // console.log('loginTOKEN', userLookup.id);
//     if (!token) return res.status(500).send('Secret is broken');

//     res.status(200).json({ token, userId: userLookup._id });
//   } catch (err) {
//     next(err);
//   }
// });

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
