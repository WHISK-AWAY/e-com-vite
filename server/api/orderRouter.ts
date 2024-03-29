import express from 'express';
import mongoose from 'mongoose';
import { checkAuthenticated, sameUserOrAdmin } from './authMiddleware';
const router = express.Router({ mergeParams: true });
import { z } from 'zod';
import validator from 'validator';
import { User, Order, Promo, Product } from '../database/index';
import { zodOrder, zodUserId, zodOrderId } from '../utils';
import { ImageData, TProduct } from '../database/dbTypes';

const zodCreateOrder = zodOrder
  .strict()
  .refine(
    (data) => {
      return (
        data.user.shippingInfo.firstName !== undefined ||
        data.user.shippingInfo.lastName !== undefined ||
        data.user.shippingInfo.email !== undefined ||
        data.user.shippingInfo.address_1 !== undefined ||
        data.user.shippingInfo.address_2 !== undefined ||
        data.user.shippingInfo.city !== undefined ||
        data.user.shippingInfo.state !== undefined ||
        data.user.shippingInfo.zip !== undefined ||
        data.promoCode?.promoCodeName !== undefined
      );
    },
    {
      message: 'All not optional fields are required',
    }
  )
  .refine(
    (cc) => {
      // console.log('CC validator', cc.user.paymentInfo?.cardNum);
      if (!cc.user.paymentInfo) return false; // ? may not be the correct approach - leaving this here for now to appease TS
      return validator.isCreditCard(cc.user.paymentInfo.cardNum);
    },
    {
      message: 'CreditCard validation failed',
    }
  );

// ensure correct shape of user input
type TzodOrderInput = z.infer<typeof zodOrder>;

// ensure correct shape for Order.create() query
// since promoCode exists already, have to re-write it in the way Order expects
export type TOrderQuery = Omit<TzodOrderInput, 'promoCode'> & {
  orderDetails: {
    productId: mongoose.Types.ObjectId | string;
    productName: string;
    productIngredients?: string;
    productShortDesc: string;
    imageURL: string;
    price: number;
    qty: number;
  }[];
  promoCode?: {
    promoCodeName: string;
    promoCodeRate: number;
  };
};

// have to convince TS of the shape of a "populated" user cart
type TExpandedCartProduct = {
  product: {
    _id: mongoose.Types.ObjectId;
    productName: string;
    productIngredients: string;
    productShortDesc: string;
    images: ImageData[];
    price: number;
    qty: number;
    tags: mongoose.Types.ObjectId[];
    __v: number;
  };
  price: number;
  qty: number;
  _id: mongoose.Types.ObjectId;
};

// retrieve all orders for logged-in user
router.get('/', checkAuthenticated, sameUserOrAdmin, async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const userOrders = await Order.find({ 'user.userId': userId });
    if (!userOrders.length)
      return res.status(404).json({ message: 'No orders found for this user' });

    res.status(200).json(userOrders);
  } catch (err) {
    next(err);
  }
});

// retrieve order by ID
router.get(
  '/:orderId',
  checkAuthenticated,
  sameUserOrAdmin,
  async (req, res, next) => {
    try {
      const validOrderId = zodOrderId.parse(req.params.orderId);
      const { userId } = req.params;
      const order = await Order.findById(validOrderId);

      if (!order)
        return res.status(404).send('Order with given ID does not exist');

      if (userId !== order.user.userId)
        return res
          .status(401)
          .send(
            'Provided userID does not match database record on given orderID'
          );

      res.status(200).json(order);
    } catch (err) {
      next(err);
    }
  }
);

// create new order
router.post(
  '/',
  checkAuthenticated,
  sameUserOrAdmin,
  async (req, res, next) => {
    try {
      const { userId } = req.params;
      const parsedBody = zodOrder.parse(req.body) as TzodOrderInput;

      // find user & read cart info
      const user = await User.findById(userId).populate(
        'cart.products.product'
      );
      if (!user) return res.status(404).json({ message: 'User not found' });

      // console.log('order user:', user);

      if (!user.cart.products.length)
        return res.status(409).json({ message: "User's cart is empty" });

      // re-cast user cart: TS doesn't know the shape of a "populated" cart
      const userCart = user.cart.products as unknown as TExpandedCartProduct[];

      // build up object for new order creation
      const newOrderInput: TOrderQuery = {
        orderDetails: userCart.map((prod) => {
          return {
            productId: prod.product._id,
            imageURL:
              prod.product.images.find(
                (image) => image.imageDesc === 'product-front'
              )?.imageURL || prod.product.images[0].imageURL,
            price: prod.price,
            productIngredients: prod.product.productIngredients,
            productShortDesc: prod.product.productShortDesc,
            productName: prod.product.productName,
            qty: prod.qty,
          };
        }),
        user: {
          userId,
          shippingInfo: parsedBody.user.shippingInfo,
          paymentInfo: parsedBody.user.paymentInfo,
        },
      };

      // if the user provided a promo code, verify it & add to new order object
      const userPromoCode = parsedBody.promoCode;

      if (userPromoCode) {
        const promoLookup = await Promo.findOne({
          promoCodeName: userPromoCode.promoCodeName,
        });

        if (promoLookup) {
          newOrderInput.promoCode = {
            promoCodeName: promoLookup.promoCodeName,
            promoCodeRate: promoLookup.promoRate,
          };
        }
      }

      // create new order
      const createdOrder = await Order.create(newOrderInput);

      res.status(201).json(createdOrder);
    } catch (err) {
      next(err);
    }
  }
);

// update order status
router.put(
  '/:orderId',
  checkAuthenticated,
  sameUserOrAdmin,
  async (req, res, next) => {
    try {
      const { orderId } = req.params;
      const { userId } = req.params;

      const userLookup = await User.findById(userId);

      if (!userLookup)
        return res
          .status(404)
          .json({ message: 'User with the given ID does not exist' });

      // make sure the order exists & isn't already in 'confirmed' status
      const existingOrder = await Order.findById(orderId);
      if (!existingOrder)
        return res
          .status(404)
          .json({ message: 'Order with the given ID does not exist' });

      if (existingOrder.orderStatus === 'confirmed') {
        return res
          .status(304)
          .json({ message: 'Order has already been confirmed' });
      }

      const orderLookup = await Order.findByIdAndUpdate(
        orderId.toString(),
        {
          orderStatus: 'confirmed',
        },
        { new: true }
      );

      if (orderLookup) {
        userLookup.cart.clearCart!({ restock: false });
      }

      if (!orderLookup)
        return res
          .status(404)
          .json({ message: 'Order with the given ID does not exist' });

      res.status(200).json(orderLookup);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
