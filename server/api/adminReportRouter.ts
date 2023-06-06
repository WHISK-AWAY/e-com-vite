import { Router } from 'express';
import { requireAdmin } from './authMiddleware';
import { Product } from '../database';

const router = Router();
router.use(requireAdmin);

router.get('/products', async (req, res, next) => {
  try {
    const allProducts = await Product.find().populate(['tags']);
    res.status(200).json(allProducts);
  } catch (err) {
    next(err);
  }
});

export default router;
