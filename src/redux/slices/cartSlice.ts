import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import axios, { AxiosError } from 'axios';
import { ImageData } from '../../../server/database';
const VITE_API_URL = import.meta.env.VITE_API_URL;

export interface ICart {
  products: {
    product: TProduct;
    price: number;
    qty: number;
    _id: string;
  }[];
  subtotal: number;
}

export type TProduct = {
  _id: string;
  productName: string;
  productIngredients: string;
  productShortDesc: string;
  price: number;
  qty: number;
  images: ImageData[];
  tags: {
    _id: string;
    tagName: string;
  }[];
};

export type CartState = {
  cart: ICart;
  loading: boolean;
  errors: { message: string | null; status: number | null };
};

/**
 * * Cart Slice
 */

const initialState: CartState = {
  cart: {} as ICart,
  loading: false,
  errors: { message: null, status: null },
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    /**
     * * FETCH USER CART
     */

    builder
      .addCase(fetchUserCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserCart.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.cart = payload;
        state.errors = { ...initialState.errors };
      })
      .addCase(fetchUserCart.rejected, (_, action: PayloadAction<any>) => {
        return { ...initialState, errors: action.payload };
      })

      /**
       * *ADD ITEM TO CART
       */

      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.cart = payload;
        state.errors = { ...initialState.errors };
      })
      .addCase(addToCart.rejected, (_, action: PayloadAction<any>) => {
        return { ...initialState, errors: action.payload };
      })

      /**
       * * REMOVE ITEM FROM CART
       */

      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFromCart.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.cart = payload;
        state.errors = { ...initialState.errors };
      })
      .addCase(removeFromCart.rejected, (_, action: PayloadAction<any>) => {
        return { ...initialState, errors: action.payload };
      });
  },
});

// * FETCH USER CART
export const fetchUserCart = createAsyncThunk(
  'cart/fetchUserCart',
  async (userId: string, thunkApi) => {
    if (!userId || userId === 'null')
      return thunkApi.rejectWithValue({
        status: 400,
        message: 'Must be logged in',
      });

    try {
      const { data } = await axios.get(
        VITE_API_URL + `/api/user/${userId}/cart`,
        { withCredentials: true }
      );

      return data.cart;
    } catch (err: any) {
      if (err instanceof AxiosError)
        return thunkApi.rejectWithValue({
          status: err.response?.status,
          message: err.response?.data.message,
        });
      else console.error(err);
    }
  }
);

//*ADD TO CART
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (
    args: { userId: string; productId: string; qty: number },
    thunkApi
  ) => {
    try {
      const { data } = await axios.post(
        VITE_API_URL + `/api/user/${args.userId}/cart/add-item`,
        { productId: args.productId, qty: args.qty },
        { withCredentials: true }
      );

      return data.cart;
    } catch (err) {
      if (err instanceof AxiosError)
        return thunkApi.rejectWithValue({
          status: err.response?.status,
          message: err.response?.data.message,
        });
      else console.error(err);
    }
  }
);

//* REMOVE FAROM CART
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (
    args: { userId: string; productId: string; qty: number },
    thunkApi
  ) => {
    try {
      const { data } = await axios.post(
        VITE_API_URL + `/api/user/${args.userId}/cart/remove-item`,
        { productId: args.productId, qty: args.qty },
        { withCredentials: true }
      );

      // console.log('data from reove cart item', data);
      return data.cart;
    } catch (err: any) {
      return thunkApi.rejectWithValue({
        status: err.response.status,
        message: err.response.message,
      });
    }
  }
);

export const selectCart = (state: RootState) => state.cart;
export default cartSlice.reducer;
