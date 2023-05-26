import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import axios, { AxiosError } from 'axios';

const VITE_API_URL = import.meta.env.VITE_API_URL;

/**
 * * TYPES
 */

type TOrder = {
  _id?: string;
  orderDetails: {
    productId: string;
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
  orderStatus: 'confirmed' | 'pending' | 'canceled';
  date: Date;
  subtotal?: number;
  total?: number;
};

type OrderState = {
  allOrders: TOrder[];
  singleOrder: TOrder | null;
  loading: boolean;
  errors: {
    status: number | null;
    message: string | null;
  };
};

/**
 * * THUNKS
 */

export const fetchAllOrders = createAsyncThunk(
  'order/fetchAllOrders',
  async (userId: string, thunkApi) => {
    try {
      const { data } = await axios.get(
        VITE_API_URL + `/api/user/${userId}/order`,
        { withCredentials: true }
      );
      return data; // ! make sure this is an array of orders
    } catch (err) {
      if (err instanceof AxiosError) {
        return thunkApi.rejectWithValue({ status: 123, message: 'TODO' });
      }
    }
  }
);

/**
 * * ORDER SLICE
 */

const initialState: OrderState = {
  allOrders: [] as TOrder[],
  singleOrder: null,
  loading: false,
  errors: {
    status: null,
    message: null,
  },
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllOrders.fulfilled, (_, { payload }) => {
        return { ...initialState, allOrders: payload };
      })
      .addCase(fetchAllOrders.rejected, (_, action: PayloadAction<any>) => {
        return { ...initialState, errors: action.payload };
      });
  },
});

export const selectOrderState = (state: RootState) => state.order;
export default orderSlice.reducer;