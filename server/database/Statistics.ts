import mongoose, { Schema, Types } from 'mongoose';

export interface IBestsellerRef {
  bestsellerRef: {
    productId: Types.ObjectId;
    saleCount: number;
  };
}
const statsSchema = new Schema<IBestsellerRef>({
  bestsellerRef: {
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    saleCount: { type: Number, default: 0 },
  },
});

// statsSchema.post('update', )

export default mongoose.model('Statistics', statsSchema);
