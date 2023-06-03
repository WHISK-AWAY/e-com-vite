import { Router } from 'express';
import { z } from 'zod';
import { checkAuthenticated, sameUserOrAdmin } from './authMiddleware';
import { Shipping, User } from '../database/index';
const router = Router({ mergeParams: true });

const ZShippingAddress = z
  .object({
    userId: z.string(),
    isDefault: z.boolean(),
    shipToAddress: z.object({
      firstName: z.string().min(2),
      lastName: z.string().min(2),
      email: z.string().email(),
      address_1: z.string(),
      address_2: z.string().optional(),
      city: z.string(),
      state: z.string().min(2),
      zip: z.string().min(5),
    }),
  })
  .strict();

/**
 * * CREATE NEW SHIPPING ADDRESS
 */

router.post(
  '/',
  checkAuthenticated,
  sameUserOrAdmin,
  async (req, res, next) => {
    try {
      const { userId } = req.params;
      const shippingData = ZShippingAddress.parse(req.body);
      if (shippingData.isDefault) {
        // find & update any existing default address for this user
        await Shipping.updateMany(
          { userId, isDefault: true },
          { isDefault: false }
        );
      }
      if (shippingData.shipToAddress.address_2 === '')
        delete shippingData.shipToAddress.address_2;
      await Shipping.create(shippingData);
      const updatedUser = await User.findById(userId, '-password')
        .populate({ path: 'cart.products.product', populate: { path: 'tags' } })
        .populate({ path: 'favorites', populate: { path: 'tags' } })
        .populate('shippingAddresses');
      res.status(200).json(updatedUser);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * * EDIT EXISTING SHIPPING ADDRESS
 */

router.put(
  '/:shippingAddressId',
  checkAuthenticated,
  sameUserOrAdmin,
  async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { shippingAddressId } = req.params;

      if (!userId || !shippingAddressId) {
        return res.status(404).json({ message: 'Record does not exist' });
      }

      const parsedBody = ZShippingAddress.deepPartial().parse(req.body);

      if (parsedBody.isDefault) {
        // find & update any existing default address for this user
        await Shipping.updateMany(
          { userId, isDefault: true, _id: { $ne: shippingAddressId } },
          { isDefault: false }
        );
      }

      await Shipping.findOneAndUpdate({ _id: shippingAddressId }, parsedBody);

      const updatedUser = await User.findById(userId, '-password')
        .populate({ path: 'cart.products.product' })
        .populate('favorites')
        .populate('shippingAddresses');

      res.status(200).json(updatedUser);
    } catch (err) {
      next(err);
    }
  }
);
export default router;
