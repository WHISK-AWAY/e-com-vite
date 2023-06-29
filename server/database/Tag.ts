import mongoose, { Schema, Types } from 'mongoose';
import { IProduct } from './dbTypes';

export interface ITag {
  _id?: Types.ObjectId;
  products?: IProduct[];
  tagName: string;
}

const tagSchema = new Schema<ITag>(
  {
    tagName: { type: String, required: true, unique: true, minlength: 3 },
  },
  {
    toJSON: {
      virtuals: true,
    },
    virtuals: {
      products: {
        options: {
          ref: 'Product',
          localField: '_id',
          foreignField: 'tags',
          justOne: false,
        },
      },
    },
  }
);

export default mongoose.model('Tag', tagSchema);
