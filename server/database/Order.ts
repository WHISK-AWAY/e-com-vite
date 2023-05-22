import mongoose, { Schema, Types } from 'mongoose';

export interface IOrder {
  _id?: Types.ObjectId;
  orderDetails: {
    productId: Types.ObjectId;
    productName: string;
    productLongDesc: string;
    productShortDesc: string;
    brand: string;
    imageURL: string;
    price: number;
    qty: number;
  }[];

  user: {
    userId?: string;
    shippingInfo: {
      firstName: string;
      lastName: string;
      email: string;
      address_1: string;
      address_2?: string;
      city: string;
      state: string;
      zip: string;
    };
    paymentInfo?: {
      paymentType: string;
      cardNum: string;
      exp: string;
      cvv: string;
    };
  };
  promoCode?: {
    promoCodeName: string;
    promoCodeRate: number;
  };
  orderStatus: 'confirmed' | 'pending' | 'canceled' | 'returned';
  date: Date;
  subtotal?: number;
  total?: number;
}

const orderSchema = new Schema<IOrder>(
  {
    orderDetails: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product' },
        productName: { type: String, required: true },
        productLongDesc: { type: String, required: true },
        productShortDesc: { type: String, required: true },
        brand: { type: String, required: true },
        imageURL: { type: String, required: true },
        price: { type: Number, required: true },
        qty: { type: Number, required: true },
      },
    ],
    user: {
      userId: { type: String, ref: 'User' },
      shippingInfo: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        address_1: { type: String, required: true },
        address_2: String,
        city: { type: String, required: true },
        state: { type: String, required: true },
        zip: { type: String, required: true },
      },
      paymentInfo: {
        paymentType: { type: String, required: true },
        // cardType: {type: String, requred: true},
        cardNum: { type: String, required: true },
        exp: { type: String, required: true },
        cvv: String,
      },
    },
    promoCode: {
      promoCodeName: String,
      promoCodeRate: Number,
    },
    date: { type: Date, default: Date.now },
    orderStatus: { type: String, requires: true },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

orderSchema.virtual('subtotal').get(function () {
  let tot = 0;
  for (let prod of this.orderDetails) {
    tot += prod.price * prod.qty;
  }

  return +tot.toFixed(2);
});

orderSchema.virtual('total').get(function () {
  let tot: number = this.subtotal || 0;

  if (this.promoCode) {
    if (this.promoCode.promoCodeRate)
      tot = tot * (1 - this.promoCode.promoCodeRate);
  }
  return +tot.toFixed(2);
});

export default mongoose.model('Order', orderSchema);

// order {
//  orderDetails [{id,
//   "lotion",
//   "its a lotion",
//   "tippytoe",
//   7,
//   39.99,
//   'imgURLnfjusdfnjksdfnjks',
//  }],

//   'wholesale20',

//  user {
//    _id,
//   shipping{
//     address,
//     name etc
//   },
//   payment{
//     paymentinfo...
//   },
//   'comfirmed',
//   '05/18/23',

// }
// }
