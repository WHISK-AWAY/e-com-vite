import mongoose from 'mongoose';
import { z } from 'zod';

export const zodUserId = z
  .string()
  .uuid({ message: 'Provided user ID is not of the correct format' });

export const zodOrderId = z.string().refine(
  (orderId) => {
    return mongoose.Types.ObjectId.isValid(orderId);
  },
  {
    message: 'Invalid orderID',
  }
);

export const zodUser = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8).max(20),
  address: z
    .object({
      address_1: z.string(),
      address_2: z.string().optional(),
      city: z.string(),
      state: z.string(),
      zip: z.string(),
    })
    .optional(),
  confirmPassword: z.string().min(8).max(20),
  favorites: z.array(z.string()).optional(),
});

export const zodProduct = z.object({
  productName: z.string().min(3),
  productIngredients: z.string().min(20),
  productShortDesc: z.string().min(10),
  price: z.number().nonnegative().gt(20),
  qty: z.number().nonnegative().gt(0),
  images: z.array(
    z.object({
      image: z.string(),
      imageURL: z.string(),
      imageDesc: z.enum([
        'product-front',
        'product-close',
        'product-packaging-back',
        'product-texture',
        'video-usage',
      ]),
    })
  ),
  tags: z.string().min(3).array(),
});

export const zodReview = z.object({
  title: z.string().min(10).max(40),
  content: z.string().min(30),
  rating: z.object({
    overall: z.number().nonnegative().gte(1).lte(5),
    quality: z.number().nonnegative().gte(1).lte(5),
    value: z.number().nonnegative().gte(1).lte(5),
  }),
  skinConcernOptions: z
    .object({
      value: z.string(),
      label: z.string(),
    })
    .array()
    .min(3, 'minimum of 3 skin concerns')
    .max(5, 'maximum of 5 skin concerns'),
  nickname: z.string().min(2).optional(),
  location: z.string().min(2).optional(),
});

export const zodOrder = z.object({
  user: z.object({
    userId: z.string().optional(),
    shippingInfo: z.object({
      firstName: z.string().min(2),
      lastName: z.string().min(2),
      email: z.string().email(),
      address_1: z.string().min(5),
      address_2: z.string().min(2).optional(),
      city: z.string().min(1),
      state: z.string().min(2),
      zip: z.string().min(5),
    }),
    paymentInfo: z
      .object({
        paymentType: z.string().min(3),
        cardNum: z.string().min(16),
        exp: z.string(),
        cvv: z.string().min(3),
      })
      .optional(),
  }),
  promoCode: z
    .object({
      promoCodeName: z.string().min(2),
    })
    .optional(),
});
