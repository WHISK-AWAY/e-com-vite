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
    ({ firstName, lastName, email, address, password }) => {
      return (
        firstName !== undefined ||
        lastName !== undefined ||
        email !== undefined ||
        password !== undefined ||
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
        return res
          .status(404)
          .json({ message: 'User with this ID does not exist' });

      // console.log('req.body',req.body)
      const updateUserInput = updateZodUser.parse(req.body);

      if (!updateUserInput || updateUserInput === undefined)
        return res.status(404).json({ message: 'Nothing to update' });

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        updateUserInput,
        { new: true, projection: '-password' }
      )
        .populate({ path: 'cart.products.product', populate: { path: 'tags' } })
        .populate({ path: 'favorites', populate: { path: 'tags' } });
      res.status(200).json(updatedUser);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * * ADD/REMOVE FAVORITE
 */

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
        await user.save();
      } else if (!user.favorites.some((fav) => fav.toString() === productId)) {
        user.favorites.push(new mongoose.Types.ObjectId(productId));
        await user.save();
      }

      // if favorite already exists, this just returns the existing user
      const updatedUser = await User.findById(userId, '-password')
        .populate({ path: 'cart.products.product', populate: { path: 'tags' } })
        .populate({ path: 'favorites', populate: { path: 'tags' } });

      res.status(200).json(updatedUser);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  '/:userId/remove-favorite',
  checkAuthenticated,
  async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { productId } = ZFavorite.parse(req.body);
      // console.log('reqb', req.body);
      const user = await User.findById(userId, '-password').populate([
        'cart.products.product',
        'favorites',
      ]);

      if (!user)
        return res
          .status(404)
          .json({ message: 'User with given ID does not exits' });

      if (!user.favorites)
        return res
          .status(404)
          .send({ message: 'User does not have any favorites' });

      user.favorites = user.favorites.filter((fav) => {
        return String(fav._id) !== productId;
      });
      await user.save();

      const updatedUser = await User.findById(userId, '-password')
        .populate({ path: 'cart.products.product', populate: { path: 'tags' } })
        .populate({ path: 'favorites', populate: { path: 'tags' } });

      res.status(200).json(updatedUser);
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
