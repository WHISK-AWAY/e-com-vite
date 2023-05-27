// This is your test secret API key.
import { Response, Request, NextFunction } from 'express';
import express from 'express';
import { checkAuthenticated } from './authMiddleware';
import { User } from '../database/index';
import { number } from 'zod';
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY
const stripe = require('stripe')(
  STRIPE_SECRET_KEY
);
// const express = require('express');
const router = express.Router();

// const app = express();
// app.use(express.static('public'));

const YOUR_DOMAIN = 'http://localhost:5173';

// const calculateOrderAmount = (items) => {
//   // Replace this constant with a calculation of the order's amount
//   // Calculate the order total on the server to prevent
//   // people from directly manipulating the amount on the client
//   return 1400;
// };

router.post(
  '/create-payment-intent',
  checkAuthenticated,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const { items } = req.body;
      const userId = req.userId;
      const userLookup = await User.findById(userId);

      if (!userLookup)
        return res
          .status(404)
          .json({ message: 'User with the given ID does not exist' });

      const subtotal = (await userLookup?.cart.subtotal) as unknown as number;
      if (!subtotal) return res.status(400).send('bad');
      console.log('sub', subtotal);
      console.log('UL', userLookup);

      // Create a PaymentIntent with the order amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
        amount: subtotal * 100,
        currency: 'usd',
        automatic_payment_methods: {
          enabled: true,
        },
      });

      // console.log('PI', paymentIntent);
      res.json({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (err) {
      next(err);
    }
  }
);

// app.listen(4242, () => console.log('Running on port 5173'));

export default router;
