export { default as Order } from './Order';
export type { IOrder } from './Order';
export { default as Promo } from './Promo';
export type { IPromo } from './Promo';
export { default as Product } from './Product';
export { default as Review } from './Review';
export type { IReview } from './Review';
export { default as Tag } from './Tag';
export type { ITag } from './Tag';
export { default as User } from './User';
export type {
  IUser,
  ICart,
  TCartReturn,
  TProduct,
  IProduct,
  ImageData,
} from './dbTypes';
export { default as UserVote } from './UserVote';
export type { IUserVote } from './UserVote';
export { default as Statistics } from './Statistics';
export type { IBestsellerRef } from './Statistics';
export { default as Shipping } from './ShippingInfo';
export type { IShippingAddress } from './ShippingInfo';

import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
export const MONGO_DB_URL = process.env.MONGO_DB_URL;

export async function mongooseConnection() {
  return await mongoose.connect(MONGO_DB_URL!, {
    minPoolSize: 100,
    maxPoolSize: 1000,
    heartbeatFrequencyMS: 5000,
    serverSelectionTimeoutMS: 45000,
    // keepAlive: true,
    // keepAliveInitialDelay: 300000,
  });
}
