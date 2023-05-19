import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { Types } from 'mongoose';
import { RootState } from '../store';
const VITE_API_URL = import.meta.env.VITE_API_URL;

const fetchAllProducts = createAsyncThunk(
  'product/fetchAllProducts',
  async (page: number, thunkApi) => {
    try {
      let { data }: { data: { products: TProduct[]; count: number } } =
        await axios.get(VITE_API_URL + '/api/product', { params: { page } });

      // console.log('data', data);
      return data;
    } catch (err) {
      if (err instanceof AxiosError && err.response?.status === 404) {
        throw thunkApi.rejectWithValue({ status: err.response.status });
      }
    }
  }
);

const fetchSingleProduct = createAsyncThunk(
  'product/fetchSingleProduct',
  async (productId: string, thunkApi) => {
    try {
      let { data }: { data: TProduct } = await axios.get(
        VITE_API_URL + `/api/product/${productId}`
      );
      // console.log('data', data);
      return data;
    } catch (err: any) {
      return thunkApi.rejectWithValue({ status: err.response.status });
    }
  }
);

const initialState: ProductState = {
  allProducts: {
    products: [],
    count: null,
  },
  singleProduct: null,
  loading: false,
  error: {
    status: null,
  },
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    /**
     * * ALL PRODUCTS
     */

    builder
      .addCase(fetchAllProducts.fulfilled, (state, { payload }) => {
        if (!payload) return { ...initialState, error: { status: 404 } };
        state.allProducts.products = payload.products;
        state.allProducts.count = payload.count;
        state.loading = false;
        state.error.status = null;
      })
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchAllProducts.rejected,
        (state, action: PayloadAction<any>) => {
          return { ...initialState, error: { status: action.payload.status } };
        }
      )

      /**
       * * SINGLE PRODUCT
       */
      .addCase(fetchSingleProduct.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchSingleProduct.fulfilled, (state, { payload }) => {
        if (!payload)
          return {
            ...state,
            singleProduct: initialState.singleProduct,
            error: { status: 404 },
          };
        state.singleProduct = payload;
        state.loading = false;
        state.error.status = null;
      })
      .addCase(
        fetchSingleProduct.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = { status: action.payload.status };
        }
      );
  },
});

export type TTag = {
  _id?: Types.ObjectId;
  tagName: string;
};

export type TProduct = {
  _id: Types.ObjectId;
  productName: string;
  productLongDesc: string;
  productShortDesc: string;
  brand: string;
  price: number;
  qty: number;
  imageURL: string;
  tags: TTag[];
};

export interface ProductState {
  allProducts: { products: TProduct[]; count: number | null };
  singleProduct: TProduct | null;
  loading: boolean;
  error: { status: number | null };
}

export { fetchAllProducts, fetchSingleProduct };
export const selectAllProducts = (state: RootState) =>
  state.product.allProducts;
export const selectSingleProduct = (state: RootState) =>
  state.product.singleProduct;
export default productSlice.reducer;
