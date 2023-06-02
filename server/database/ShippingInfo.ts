import mongoose, { Schema, Types } from 'mongoose';
import User from './User';
import { mongooseConnection } from '.';

export interface IShippingAddress {
  _id: Types.ObjectId;
  userId: string;
  isDefault: boolean;
  shipToAddress: {
    firstName: string;
    lastName: string;
    email: string;
    address_1: string;
    address_2?: string;
    city: string;
    state: string;
    zip: string;
  };
}

export interface ShippingSchema extends mongoose.Document {
  _id: Types.ObjectId;
  userId: string;
  isDefault: boolean;
  shipToAddress: {
    firstName: string;
    lastName: string;
    email: string;
    address_1: string;
    address_2?: string;
    city: string;
    state: string;
    zip: string;
  };
}

const shippingSchema = new Schema<ShippingSchema>({
  userId: {
    type: String,
    ref: 'User',
    required: true,
  },
  isDefault: {
    type: Boolean,
    required: true,
    default: false,
  },
  shipToAddress: {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address_1: {
      type: String,
      required: true,
    },
    address_2: String,
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zip: {
      type: String,
      required: true,
    },
  },
});

export default mongoose.model('Shipping', shippingSchema);
