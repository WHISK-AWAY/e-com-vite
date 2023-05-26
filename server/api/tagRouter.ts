import { Router } from 'express';
import { Tag } from '../database/index';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const tags = await Tag.find({});
    res.status(200).json(tags);
  } catch (err) {
    next(err);
  }
});

export default router;
