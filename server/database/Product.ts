import mongoose, { Schema } from 'mongoose';
import type { IProduct } from './dbTypes';

const productSchema = new Schema<IProduct>({
  productName: { type: String, required: true, unique: true },
  productIngredients: { type: String, required: true },
  productShortDesc: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, required: true },
  images: [
    {
      image: String,
      imageURL: String,
      imageDesc: String,
    },
  ],
  tags: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Tag',
    },
  ],
  saleCount: { type: Number, required: true, default: 0 },
});

export default mongoose.model('Product', productSchema);
