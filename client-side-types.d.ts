import mongoose, { Types } from 'mongoose';

type TProduct = {
  product: mongoose.Types.ObjectId;
  price: number;
  qty: number;
};

interface ICart {
  products: TProduct[];
  subtotal?(): number;
  addProduct?(productId: string, qty: number): Promise<TCartReturn | null>;
  clearCart?(options?: { restock: boolean }): void;
  removeProduct?(productId: string, qty?: number): void;
  updatedAt?: Date;
  createdAt?: Date;
}

type TCartReturn = {
  productId: mongoose.Types.ObjectId;
  productName: string;
  qtyAdded: number;
};

interface IUser extends mongoose.Document {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  address?: {
    address_1: string;
    address_2?: string;
    city: string;
    state: string;
    zip: string;
  };
  favorites?: mongoose.Types.ObjectId[];
  cart: ICart;
  role: 'admin' | 'user' | 'guest';
  reviewCount?: number;
  voteCount?: number;
  skinConcerns?: string[];
  purgeInactiveCart?(): void;
}

type ImageData = {
  image: string;
  imageURL: string;
  imageDesc: ImageDesc;
};

type ImageData = {
  image: string;
  imageURL: string;
  imageDesc: ImageDesc;
}

type ImageDesc =
  | 'product-front'
  | 'product-close'
  | 'product-back'
  | 'product-packaging-back'
  | 'product-texture'
  | 'product-alt'
  | 'product-dimensions'
  | 'product-usage'
  | 'video-usage'
  | 'gif-product'
  | 'video-product';

interface IProduct {
  _id?: Types.ObjectId;
  productName: string;
  productIngredients: string;
  productShortDesc: string;
  price: number;
  qty: number;
  tags: Types.ObjectId[];
  saleCount: number;
  images: ImageData[];
}

type ZodCreateProduct = {
  productName: string;
  productIngredients: string;
  productShortDesc: string;
  price: number;
  qty: number;
  images: {
    image: string;
    imageURL: string;
    imageDesc:
      | 'product-front'
      | 'product-close'
      | 'product-packaging-back'
      | 'product-texture'
      | 'video-usage';
  }[];
  tags: string[];
};

type ZodEditProduct = Partial<ZodCreateProduct>;

type UserSignUpInput = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    address?: {
        address_1: string;
        city: string;
        state: string;
        zip: string;
        address_2?: string | undefined;
    } | undefined;
    favorites?: string[] | undefined;
}
