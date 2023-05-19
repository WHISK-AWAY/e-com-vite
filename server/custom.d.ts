// import { IUser } from './database/dbTypes';

declare namespace Express {
  export interface Request {
    isAuthenticated: () => boolean;
    userId?: string;
  }

  export interface User {
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
}
