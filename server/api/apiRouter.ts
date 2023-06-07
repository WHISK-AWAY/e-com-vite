import express from 'express';
import userRouter from './userRouter';
import authRouter from './authRouter';
import productRouter from './productRouter';
import adminOrderRouter from './adminOrderRouter';
import adminReviewRouter from './adminReviewRouter';
import adminReportRouter from './adminReportRouter';
import adminUserRouter from './adminUserRouter';
import promoRouter from './promoRouter';
import checkoutRouter from './checkoutRouter';
import stripeRouter from './stripeRouter';
import tagRouter from './tagRouter';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/product', productRouter);
router.use('/adminOrder', adminOrderRouter);
router.use('/admin-review', adminReviewRouter);
router.use('/admin-report', adminReportRouter);
router.use('/admin-user', adminUserRouter);
router.use('/promo', promoRouter);
// router.use('/checkout', checkoutRouter);
router.use('/checkout', stripeRouter);
router.use('/tag', tagRouter);

export default router;
