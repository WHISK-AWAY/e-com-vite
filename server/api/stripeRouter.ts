// This is your test secret API key.
import { Response, Request, NextFunction } from 'express';
const stripe = require('stripe')(
  'sk_test_51MhPjfBUQ6Oq9GtlnK1ksaPnlK2gGtXwS6RQGUWFogQMbLVKQllwO3kME0i4ZbBtruPXj5ao7kpxEkZ4x1SPUUpn00AcJ0lTm8'
);
const express = require('express');
const router = express.Router();

// const app = express();
// app.use(express.static('public'));

const YOUR_DOMAIN = 'http://localhost:5173';

router.post(
  '/create-checkout-session',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
            price: 30000,
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${YOUR_DOMAIN}/checkout/success`,
        cancel_url: `${YOUR_DOMAIN}/checkout/failure`,
      });

      res.redirect(303, session.url);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
);

// app.listen(4242, () => console.log('Running on port 5173'));

export default router;
