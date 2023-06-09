import mongoose, { Schema, Types } from 'mongoose';

export interface IProduct {
  _id?: Types.ObjectId;
  productName: string;
  productIngredients: string;
  productShortDesc: string;
  price: number;
  qty: number;
  imageURL: string[];
  tags: Types.ObjectId[];
  saleCount: number;
}

const productSchema = new Schema<IProduct>({
  productName: { type: String, required: true, unique: true },
  productIngredients: { type: String, required: true },
  productShortDesc: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, required: true },
  imageURL: [{ type: String, required: true }],
  tags: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Tag',
    },
  ],
  saleCount: { type: Number, required: true, default: 0 },
});

export default mongoose.model('Product', productSchema);
