import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { UserProduct } from '../userSlice';
const VITE_API_URL = import.meta.env.VITE_API_URL;
import axios, { AxiosError } from 'axios';
import { RootState } from '../../store';
import { zodProduct } from '../../../../server/utils';
import z from 'zod';

export interface ProductState {
  allProducts: { products: UserProduct[] };
  singleProduct: UserProduct | null;
  loading: boolean;
  errors: { status: number | null; message: string | null };
}

export type ZodCreateProduct = z.infer<typeof zodProduct>;
export type ZodEditProduct = Partial<z.infer<typeof zodProduct>>;

const initialState: ProductState = {
  allProducts: {
    products: [],
  },
  singleProduct: null,
  loading: false,
  errors: {
    status: null,
    message: null,
  },
};

export const adminFetchAllProducts = createAsyncThunk(
  'allProducts/adminFetchAllProducts',
  async (_, thunkApi) => {
    try {
      const { data } = await axios.get(VITE_API_URL + '/api/product/admin', {
        withCredentials: true,
      });

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

export const adminCreateSingleProduct = createAsyncThunk(
  'singleProduct/adminCreateSingleProduct',
  async (product: ZodCreateProduct, thunkApi) => {
    try {
      const { data } = await axios.post(
        VITE_API_URL + '/api/product',
        product,
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

export const adminEditSingleProduct = createAsyncThunk(
  'singleProduct/adminEditSingleProduct',
  async (
    { product, productId }: { product: ZodEditProduct; productId: string },
    thunkApi
  ) => {
    try {
      const { data } = await axios.put(
        VITE_API_URL + `/api/product/${productId}`,
        product,
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

export const adminDeleteSingleProduct = createAsyncThunk(
  'singleProduct/adminDeleteSingleProduct',
  async (productId: string, thunkApi) => {
    try {
      const { data } = await axios.delete(
        VITE_API_URL + `/api/product/${productId}`,
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
export type TColumnFields = {
  productName: string;
  qty: number;
  price: number;
  saleCount: number;
};

export const adminProductSlice = createSlice({
  name: 'adminProduct',
  initialState,
  reducers: {
    sort: (
      state,
      {
        payload: { column, sortDir },
      }: { payload: { column: keyof TColumnFields; sortDir: string } }
    ) => {
      return {
        ...state,
        allProducts: {
          products: [...state.allProducts.products].sort((a: any, b: any) => {
            if (sortDir === 'desc' && column === 'productName') {
              return a.productName > b.productName ? 1 : -1;
            }
            if (sortDir === 'asc' && column === 'productName') {
              return a.productName < b.productName ? 1 : -1;
            }
            if (sortDir === 'desc' && column === 'qty') {
              return b.qty - a.qty;
            }
            if (sortDir === 'asc' && column === 'qty') {
              return a.qty - b.qty;
            }
            if (sortDir === 'desc' && column === 'price') {
              return b.price - a.price;
            }
            if (sortDir === 'asc' && column === 'price') {
              return a.price - b.price;
            }
            if (sortDir === 'desc' && column === 'saleCount') {
              return b.saleCount - a.saleCount;
            }
            if (sortDir === 'asc' && column === 'saleCount') {
              return a.saleCount - b.saleCount;
            }

            return 1;
          }),
        },
      };
    },
  },
  extraReducers: (builder) => {
    /**
     * *FETCH ALL PRODUCTS
     */
    builder
      .addCase(adminFetchAllProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(adminFetchAllProducts.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.allProducts.products = payload;
        state.errors = { ...initialState.errors };
      })
      .addCase(
        adminFetchAllProducts.rejected,
        (state, { payload }: PayloadAction<any>) => {
          state.loading = false;
          state.errors = payload;
        }
      )

      /**
       * * CREATE NEW PRODUCT
       */

      .addCase(adminCreateSingleProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(adminCreateSingleProduct.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.singleProduct = payload;
        state.errors = { ...initialState.errors };
      })
      .addCase(
        adminCreateSingleProduct.rejected,
        (state, { payload }: PayloadAction<any>) => {
          state.loading = false;
          state.errors = payload;
        }
      )

      /**
       * *EDIT SINGLE PRODUCT
       */

      .addCase(adminEditSingleProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(adminEditSingleProduct.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.singleProduct = payload;
        state.errors = { ...initialState.errors };
      })
      .addCase(
        adminEditSingleProduct.rejected,
        (state, { payload }: PayloadAction<any>) => {
          state.loading = false;
          state.errors = payload;
        }
      )

      /**
       * * DELETE SINGLE PRODUCT
       */
      .addCase(adminDeleteSingleProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(adminDeleteSingleProduct.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.singleProduct = payload;
        state.errors = { ...initialState.errors };
      })
      .addCase(
        adminDeleteSingleProduct.rejected,
        (state, { payload }: PayloadAction<any>) => {
          state.loading = false;
          state.errors = payload;
        }
      );
  },
});

export default adminProductSlice.reducer;
export const { sort } = adminProductSlice.actions;
export const adminSelectAllProducts = (state: RootState) => state.adminProducts;
