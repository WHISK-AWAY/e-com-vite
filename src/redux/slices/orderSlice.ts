import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import axios, { AxiosError } from 'axios';

const VITE_API_URL = import.meta.env.VITE_API_URL;

/**
 * * TYPES
 */

export type TOrder = {
  _id?: string;
  orderDetails: {
    productId: string;
    productName: string;
    productShortDesc: string;
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
        return thunkApi.rejectWithValue({
          message: err.response?.data.message,
          status: err.response?.status,
        });
      }
    }
  }
);

/**
 * * CREATE GUEST ORDER
 */
export const createGuestOrder = createAsyncThunk(
  'order/createGuestOrder',
  async (order: Partial<TOrder>, thunkApi) => {
    try {
      const cart = localStorage.getItem('guestCart');
      if (!cart) return;
      const { data } = await axios.post(
        VITE_API_URL + '/api/guest-order',
        { order, cart },
        {
          withCredentials: true,
        }
      );

      return data;
    } catch (err) {
      if (err instanceof AxiosError) {
        thunkApi.rejectWithValue({
          message: err.response?.data.message,
          status: err.response?.status,
        });
      }
      return thunkApi.rejectWithValue(err);
    }
  }
);

/**
 * *FETCH GUEST ORDER
 */

export const fetchGuestOrder = createAsyncThunk(
  'order/fetchGuestOrder',
  async (orderId: string, thunkApi) => {
    try {
      const { data } = await axios.get(
        VITE_API_URL + `/api/guest-order/${orderId}`,

        { withCredentials: true }
      );

      return data;
    } catch (err) {
      if (err instanceof AxiosError) {
        thunkApi.rejectWithValue({
          message: err.response?.data.message,
          status: err.response?.status,
        });
      }
      return thunkApi.rejectWithValue(err);
    }
  }
);
/**
 * * CREATE AN ORDER
 */
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async ({ userId, order }: { userId: string; order: TOrder }, thunkApi) => {
    try {
      const { data } = await axios.post(
        VITE_API_URL + `/api/user/${userId}/order`,
        order,
        { withCredentials: true }
      );

      // console.log('order', order);
      return data;
    } catch (err) {
      if (err instanceof AxiosError) {
        thunkApi.rejectWithValue({
          message: err.response?.data.message,
          status: err.response?.status,
        });
      }
      return thunkApi.rejectWithValue(err);
    }
  }
);

export const fetchSingleOrder = createAsyncThunk(
  'order/fetchSingleOrder',
  async (
    { userId, orderId }: { userId: string; orderId: string },
    thunkApi
  ) => {
    try {
      const { data } = await axios.get(
        VITE_API_URL + `/api/user/${userId}/order/${orderId}`,
        { withCredentials: true }
      );

      return data;
    } catch (err) {
      if (err instanceof AxiosError) {
        return thunkApi.rejectWithValue({
          status: err.response?.status,
          message: err.response?.data.message,
        });
      }
    }
  }
);
/**
 * * UPDATE AN ORDER
 */

export const updateOrder = createAsyncThunk(
  'order/updateOrder',
  async (
    { userId, orderId }: { userId: string; orderId: string },
    thunkApi
  ) => {
    try {
      const { data } = await axios.put(
        VITE_API_URL + `/api/user/${userId}/order/${orderId}`,
        {},
        { withCredentials: true }
      );

      return data;
    } catch (err) {
      if (err instanceof AxiosError) {
        return thunkApi.rejectWithValue({
          status: err.response?.status,
          message: err.response?.data.message,
        });
      }
    }
  }
);

/**
 * * UPDATE GUEST ORDER
 */

export const updateGuestOrder = createAsyncThunk(
  'order/updateGuestOrder',
  async ({ orderId }: { orderId: string }, thunkApi) => {
    window.localStorage.removeItem('guestCart');
    try {
      const { data } = await axios.put(
        VITE_API_URL + `/api/guest-order/${orderId}`,
        {},
        { withCredentials: true }
      );

      return data;
    } catch (err) {
      if (err instanceof AxiosError) {
        return thunkApi.rejectWithValue({
          status: err.response?.status,
          message: err.response?.data.message,
        });
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
  reducers: {
    resetOrderState: () => initialState,
  },
  extraReducers: (builder) => {
    /**
     * *FETCH ALL ORDERS
     */
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllOrders.fulfilled, (_, { payload }) => {
        return { ...initialState, allOrders: payload };
      })
      .addCase(fetchAllOrders.rejected, (_, action: PayloadAction<any>) => {
        return { ...initialState, errors: action.payload };
      })

      /**
       * * FETCH SINGLE ORDER
       */

      .addCase(fetchSingleOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSingleOrder.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.singleOrder = payload;
        state.errors = { ...initialState.errors };
      })
      .addCase(
        fetchSingleOrder.rejected,
        (state, { payload }: PayloadAction<any>) => {
          state.loading = false;
          state.errors = payload;
        }
      )

      /**
       * * CREATE SINGLE ORDER
       */

      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.singleOrder = payload;
        state.errors = { ...initialState.errors };
      })
      .addCase(
        createOrder.rejected,
        (state, { payload }: PayloadAction<any>) => {
          state.loading = false;
          state.errors = payload;
        }
      )

      /**
       * *FETCH GUEST ORDER
       */

      .addCase(fetchGuestOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGuestOrder.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.singleOrder = payload;
        state.errors = { ...initialState.errors };
      })
      .addCase(
        fetchGuestOrder.rejected,
        (state, { payload }: PayloadAction<any>) => {
          state.loading = false;
          state.errors = payload;
        }
      )
      /**
       * *CREATE GUEST ORDER
       */

      .addCase(createGuestOrder.pending, (state) => {
        state.loading = false;
      })
      .addCase(createGuestOrder.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.singleOrder = payload;
        state.errors = { ...initialState.errors };
      })
      .addCase(
        createGuestOrder.rejected,
        (state, { payload }: PayloadAction<any>) => {
          state.loading = false;
          state.errors = payload;
        }
      )
      /**
       * * UPDATE AN ORDER
       */

      .addCase(updateOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOrder.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.singleOrder = payload;
        state.errors = { ...initialState.errors };
      })
      .addCase(
        updateOrder.rejected,
        (state, { payload }: PayloadAction<any>) => {
          state.loading = false;
          state.errors = payload;
        }
      );

    /**
     * * UPDATE GUEST ORDER
     */
    builder
      .addCase(updateGuestOrder.pending, (state) => {
        state.loading = true;
        state.errors = initialState.errors;
      })
      .addCase(updateGuestOrder.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.singleOrder = payload;
        state.errors = { ...initialState.errors };
      })
      .addCase(
        updateGuestOrder.rejected,
        (state, { payload }: PayloadAction<any>) => {
          state.loading = false;
          state.errors = payload;
        }
      );
  },
});

export const selectOrderState = (state: RootState) => state.order;
export const selectSingleOrder = (state: RootState) => state.order.singleOrder;
export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;
