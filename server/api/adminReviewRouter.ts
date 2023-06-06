import { Router } from 'express';
import { requireAdmin } from './authMiddleware';
import { Review } from '../database';
import mongoose from 'mongoose';

const router = Router();

router.use(requireAdmin);

router.get('/', async (req, res, next) => {
  try {
    const allReviews = await Review.find().populate('product');

    return res.status(200).json(allReviews);
  } catch (err) {
    next(err);
  }
});

router.delete('/:reviewId', async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ message: 'Invalid review ID.' });
    }

    const reviewToDelete = await Review.softDelete({
      _id: req.params.reviewId,
    });

    if (reviewToDelete.deleted !== 1) {
      return res
        .status(404)
        .json({ message: 'Nothing deleted: review ID not found' });
    }

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

export default router;
