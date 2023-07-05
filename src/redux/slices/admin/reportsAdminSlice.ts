import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { UserProduct } from '../userSlice';
import { RootState } from '../../store';
import { TOrder } from '../orderSlice';

const VITE_API_URL = import.meta.env.VITE_API_URL;

/**
 * * TYPES
 */
export type TReportState = {
  allProducts: UserProduct[];
  allOrders: TOrder[];
  loading: boolean;
  errors: {
    message: string | null;
    status: number | null;
  };
};

/**
 * * THUNKS
 */

export const fetchReportProducts = createAsyncThunk(
  'reports/fetchAllProducts',
  async (_, thunkApi) => {
    try {
      const { data } = await axios.get(
        VITE_API_URL + '/api/admin-report/products',
        {
          withCredentials: true,
        }
      );
      return data;
    } catch (err) {
      if (err instanceof AxiosError) {
        return thunkApi.rejectWithValue({
          message: err.response?.data.message,
          status: err.response?.status,
        });
      }
      console.error('ERROR AT reports/fetchAllProducts:', err);
    }
  }
);

export const fetchReportOrders = createAsyncThunk(
  'reports/fetchAllOrders',
  async (_, thunkApi) => {
    try {
      const { data } = await axios.get(VITE_API_URL + '/api/adminOrder', {
        withCredentials: true,
      });
      return data;
    } catch (err) {
      if (err instanceof AxiosError) {
        return thunkApi.rejectWithValue({
          message: err.response?.data.message,
          status: err.response?.status,
        });
      }
      console.error('ERROR AT reports/fetchReportOrders:', err);
    }
  }
);

/**
 * * SLICE
 */

const initialState: TReportState = {
  allProducts: [],
  allOrders: [],
  loading: false,
  errors: {
    message: null,
    status: null,
  },
};

const reportSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    resetReportState: () => {
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    /**
     * * fetchReportProducts
     */
    builder
      .addCase(fetchReportProducts.pending, (state, _) => {
        return { ...state, loading: true };
      })
      .addCase(fetchReportProducts.fulfilled, (state, { payload }) => {
        return {
          ...state,
          errors: initialState.errors,
          loading: false,
          allProducts: payload,
        };
      })
      .addCase(
        fetchReportProducts.rejected,
        (state, { payload }: PayloadAction<any>) => {
          return { ...state, errors: payload };
        }
      );

    /**
     * * fetchReportOrders
     */
    builder
      .addCase(fetchReportOrders.pending, (state, _) => {
        return { ...state, loading: true };
      })
      .addCase(fetchReportOrders.fulfilled, (state, { payload }) => {
        return {
          ...state,
          errors: initialState.errors,
          loading: false,
          allOrders: payload,
        };
      })
      .addCase(
        fetchReportOrders.rejected,
        (state, { payload }: PayloadAction<any>) => {
          return { ...state, errors: payload };
        }
      );
  },
});

export const selectReportState = (state: RootState) => state.reports;
export const selectReportProducts = (state: RootState) =>
  state.reports.allProducts;
export const selectReportOrders = (state: RootState) => state.reports.allOrders;

export default reportSlice.reducer;
