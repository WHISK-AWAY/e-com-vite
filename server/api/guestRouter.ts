import express from 'express';
const router = express.Router();
import z from 'zod';
import { zodOrder } from '../utils';
import { TOrderQuery } from './orderRouter';
import Product from '../database/Product';
import Order from '../database/Order';
import { IProduct, ImageData, Promo } from '../database';

const zodCart = z.object({
  products: z.array(
    z.object({
      product: z.object({
        _id: z.string(),
      }),
      qty: z.number(),
    })
  ),
});

type TGuestZodOrderInput = z.infer<typeof zodOrder>;

router.get('/:orderId', async (req, res, next) => {
  try {
    const {orderId} = req.params;
    const order = await Order.findById(orderId)

    if(!order) return res.status(404).json({message: 'The order with the given ID does not exist'});


    res.status(200).json(order)
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const order = zodOrder.parse(req.body.order) as TGuestZodOrderInput;
    console.log('req.b', req.body.cart)
    const cart = zodCart.parse(JSON.parse(req.body.cart));
    const prodId = cart.products.map((p) => p.product._id);
    const product = await Product.find({ _id: { $in: prodId } });


    const newOrder: TOrderQuery = {
      orderDetails: cart.products.map((p) => {
        const prod = product.find(
          (prod: IProduct) => prod._id!.toString() === p.product._id.toString()
        );
        return {
          productId: p.product._id,
          imageURL:
            prod.images.find((image: ImageData) => image.imageDesc === 'product-front')
              ?.imageURL || prod.images[0].imageURL,
          price: prod.price,
          productShortDesc: prod.productShortDesc,
          productName: prod.productName,
          qty: p.qty,
        };
      }),

      user: {
        shippingInfo: order.user.shippingInfo,

      }
    };


    const guestPromoCode = order.promoCode;

    if(guestPromoCode) {
      const promoLookup = await Promo.findOne({
        promoCodeName: guestPromoCode.promoCodeName,
      });

      if(promoLookup) {
        newOrder.promoCode = {
          promoCodeName: promoLookup.promoCodeName,
          promoCodeRate: promoLookup.promoRate
        }
      }
    }

    const orderToCreate = await Order.create(newOrder);

    res.status(201).json(orderToCreate);
  } catch (err) {
    next(err);
  }
});

export default router;
