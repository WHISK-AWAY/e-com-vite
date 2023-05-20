import express from 'express';
const router = express.Router();
import { checkAuthenticated, sameUserOrAdmin } from './authMiddleware';
import { zodOrder } from '../utils';
import { Promo } from '../database';
import { z } from 'zod';

const zodCheckout = zodOrder.strict();

router.post('/', checkAuthenticated, async (req, res, next) => {
  try {
    const {
      user: {
        shippingInfo: {
          firstName,
          lastName,
          email,
          address_1,
          address_2,
          city,
          state,
          zip,
        },
      },
      promoCode,
    } = zodCheckout.parse(req.body);
    const promoCodeName = promoCode?.promoCodeName;

    let promoLookup;
    if (promoCode) {
      if (promoCodeName) {
        promoLookup = await Promo.findOne({ promoCodeName });
        if (!promoLookup) return res.status(404).send('Invalid promo code');
      } 
    }
    req.body.promoCode = promoLookup;

    res.status(200).json(req.body);
  } catch (err) {
    next(err);
  }
});

export default router;
