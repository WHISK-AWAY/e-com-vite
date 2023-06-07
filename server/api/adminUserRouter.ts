import { Router } from 'express';
import { requireAdmin } from './authMiddleware';
import { z } from 'zod';
import { User } from '../database';

const router = Router();
router.use(requireAdmin);

router.put('/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { role } = z
      .object({ role: z.enum(['admin', 'user', 'guest']) })
      .parse(req.body);

    const updateResult = await User.findByIdAndUpdate(userId, { role });
    console.log('updateResult', updateResult);

    const allUsers = await User.find({}, '-password');

    res.status(200).json(allUsers);
  } catch (err) {
    next(err);
  }
});

export default router;
