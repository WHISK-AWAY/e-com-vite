import express from 'express';
import userRouter from './userRouter';
import authRouter from './authRouter';
import productRouter from './productRouter';
import adminOrderRouter from './adminOrderRouter';
import promoRouter from './promoRouter';
import checkoutRouter from './checkoutRouter';
import stripeRouter from './stripeRouter'

const router = express.Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/product', productRouter);
router.use('/adminOrder', adminOrderRouter);
router.use('/promo', promoRouter);
// router.use('/checkout', checkoutRouter);
router.use('/checkout', stripeRouter)

export default router;
