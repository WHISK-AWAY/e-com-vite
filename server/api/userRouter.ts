import express from 'express';
const router = express.Router();
import { User } from '../database/index';
import cartRouter from './cartRouter';
import orderRouter from './orderRouter';
import {
  checkAuthenticated,
  requireAdmin,
  sameUserOrAdmin,
} from './authMiddleware';
import { z, ZodError } from 'zod';
import { zodUser } from '../utils';
import mongoose from 'mongoose';

const zodUserId = z.string();
const updateZodUser = zodUser
  .deepPartial()
  .strict()
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Both password related fields are required and should match',
      });
    }
  })
  .refine(
    ({ firstName, lastName, email, address }) => {
      return (
        firstName !== undefined ||
        lastName !== undefined ||
        email !== undefined ||
        address?.address_1 !== undefined ||
        address?.address_2 !== undefined ||
        address?.city !== undefined ||
        address?.state !== undefined ||
        address?.zip != undefined
      );
    },
    { message: 'At least one of the fields should be defined' }
  );

router.get('/', checkAuthenticated, requireAdmin, async (req, res, next) => {
  try {
    const allUsers = await User.find({}, '-password');
    if (!allUsers || allUsers.length === 0)
      return res.status(404).send('Users do not exist');

    res.status(200).json(allUsers);
  } catch (err) {
    next(err);
  }
});

router.get(
  '/:userId',
  checkAuthenticated,
  sameUserOrAdmin,
  async (req, res, next) => {
    try {
      const { userId } = req.params;
      const parsedBody = zodUserId.parse(userId);

      const user = await User.findById(userId, '-password')
        .populate({ path: 'cart.products.product', populate: { path: 'tags' } })
        .populate({ path: 'favorites', populate: { path: 'tags' } });

      if (!user)
        return res.status(404).send('User with the given ID does not exist');

      res.status(200).json(user);
    } catch (err) {
      if (err instanceof ZodError)
        return res.status(400).send('Invalid user ID');
      next(err);
    }
  }
);

router.put(
  '/:userId',
  checkAuthenticated,
  sameUserOrAdmin,
  async (req, res, next) => {
    try {
      const { userId } = req.params;

      const userToUpdate = await User.findById(userId);
      if (!userToUpdate)
        return res.status(404).send('User with this ID does not exist');

      const updateUserInput = req.body;
      if (!updateUserInput || updateUserInput === undefined)
        return res.status(404).send('Nothing to update');

      const parsedBody = updateZodUser.parse(updateUserInput);
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        updateUserInput,
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      next(err);
    }
  }
);

const ZFavorite = z
  .object({
    productId: z.string(),
  })
  .strict()
  .refine((input) => mongoose.Types.ObjectId.isValid(input.productId));

router.post(
  '/:userId/add-favorite',
  checkAuthenticated,
  sameUserOrAdmin,
  async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { productId } = ZFavorite.parse(req.body);

      const user = await User.findById(userId);
      if (!user)
        return res.status(404).json({ message: 'No user found with this ID' });

      if (!user.favorites) {
        // create favorites array
        user.favorites = [new mongoose.Types.ObjectId(productId)];
      } else if (user.favorites.some((fav) => fav.toString() === productId)) {
        // favorite already exists
        return res.status(304).json(user);
      } else {
        user.favorites.push(new mongoose.Types.ObjectId(productId));
      }

      await user.save();
      await user.populate('favorites');
      console.log('fav user', user);
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  '/:userId',
  checkAuthenticated,
  sameUserOrAdmin,
  async (req, res, next) => {
    try {
      const { userId } = req.params;
      const deletedUser = await User.softDelete({ _id: userId });

      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
);

router.use('/:userId/cart', cartRouter);
router.use('/:userId/order', orderRouter);

export default router;
