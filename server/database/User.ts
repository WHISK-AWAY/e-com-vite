import mongoose, { Schema } from 'mongoose';
// import Product from './Product';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { v4 as uuid } from 'uuid';
dotenv.config({ path: '../../.env ' });
const SALT_ROUNDS = process.env.SALT_ROUNDS || 10;
import { softDeletePlugin, SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import type { ICart, IUser } from './dbTypes';
import {
  addToCart,
  cartSubtotal,
  clearCart,
  removeFromCart,
} from './cartMethods';

const cartSchema = new Schema<ICart>(
  {
    products: [
      {
        product: { type: mongoose.SchemaTypes.ObjectId, ref: 'Product' },
        price: Number,
        qty: Number,
      },
    ],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const userSchema = new Schema<IUser>(
  {
    _id: { type: String, default: uuid },
    firstName: { type: String, required: true, minLength: 2 },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minLength: 8 },
    address: {
      address_1: { type: String },
      address_2: { type: String },
      city: { type: String },
      state: { type: String },
      zip: { type: String },
    },
    favorites: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Product',
      },
    ],
    cart: {
      type: cartSchema,
      default: {},
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'guest'],
      required: true,
      default: 'user',
    },
    reviewCount: { type: Number, default: 0 },
    voteCount: { type: Number, default: 0 },
  },
  { toJSON: { virtuals: true } }
);

export async function hashPassword(this: IUser) {
  // if(this.password.length > 20 || this.password.length < 8) throw new Error('Do not meet max password length requirement')
  if (this.isNew) {
    this.password = await bcrypt.hash(this.password, +SALT_ROUNDS!);
  }
}

export async function hashUpdatedPassword(
  this: IUser & { getUpdate(): IUser },
  next: any
) {
  const updatePassword = this.getUpdate() as IUser;

  if (!updatePassword?.password) return next();
  else {
    updatePassword.password = await bcrypt.hash(
      updatePassword.password,
      +SALT_ROUNDS!
    );
  }
}

userSchema.virtual('shippingAddresses', {
  ref: 'Shipping',
  localField: '_id',
  foreignField: 'userId',
  justOne: false,
});

userSchema.plugin(softDeletePlugin);

userSchema.pre('save', hashPassword); // this used to say 'validate'
userSchema.pre('findOneAndUpdate', hashUpdatedPassword);
cartSchema.methods.addProduct = addToCart;
cartSchema.methods.removeProduct = removeFromCart;
cartSchema.methods.clearCart = clearCart;
cartSchema.virtual('subtotal').get(cartSubtotal);

userSchema.static('purgeInactiveCart', async function () {
  const msPerDay = 1000 * 60 * 60 * 24;
  const purgeDay = new Date(Date.now() - msPerDay * 2);

  const allUserCart = await this.find({
    'cart.updatedAt': { $lte: purgeDay },
  });

  if (!allUserCart.length) return;
  for (let user of allUserCart) {
    await user.cart.clearCart!({ restock: true });
  }
});

export default mongoose.model<
  IUser,
  SoftDeleteModel<IUser> & { purgeInactiveCart: () => void }
>('User', userSchema);
