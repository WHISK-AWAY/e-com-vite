import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { Types } from 'mongoose';
import { RootState } from '../store';
import { TSort } from '../../components/AllProducts/AllProducts';
import { ImageData } from '../../../server/database';
const VITE_API_URL = import.meta.env.VITE_API_URL;

type TFetchAllParams = {
  page: number;
  sort: TSort;
  filter: string;
};

const fetchAllProducts = createAsyncThunk(
  'product/fetchAllProducts',
  async ({ page, sort, filter }: TFetchAllParams, thunkApi) => {
    try {
      const params: {
        page: number;
        sortKey: string;
        sortDir: string;
        filterKey: string;
      } = {
        page,
        sortKey: sort.key,
        sortDir: sort.direction,
        filterKey: filter,
      };

      let { data }: { data: { products: TProduct[]; count: number } } =
        await axios.get(VITE_API_URL + '/api/product', {
          params,
          withCredentials: true,
        });

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
        VITE_API_URL + `/api/product/${productId}`,
        { withCredentials: true }
      );
      return data;
    } catch (err: any) {
      return thunkApi.rejectWithValue({ status: err.response.status });
    }
  }
);

export const searchProducts = createAsyncThunk(
  'product/searchProducts',
  async (_, thunkApi) => {
    try {
      const { data } = await axios.get(VITE_API_URL + '/api/product/search', {
        withCredentials: true,
      });
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
  searchProducts: { products: [], tags: [] },
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
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, { payload }) => {
        if (!payload) return { ...initialState, error: { status: 404 } };
        state.allProducts.products = payload.products;
        state.allProducts.count = payload.count;
        state.loading = false;
        state.error.status = null;
      })

      .addCase(fetchAllProducts.rejected, (_, action: PayloadAction<any>) => {
        return { ...initialState, error: { status: action.payload.status } };
      })

      /**
       * * SINGLE PRODUCT
       */
      .addCase(fetchSingleProduct.pending, (state, _) => {
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
      )

      /**
       * * SEARCH PRODUCT
       */

      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchProducts.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.searchProducts = payload;
        state.error.status = null;
      })
      .addCase(
        searchProducts.rejected,
        (state, { payload }: PayloadAction<any>) => {
          state.loading = false;
          state.error = { status: payload.status };
        }
      );
  },
});

export type TTag = {
  _id?: Types.ObjectId;
  tagName: string;
};

export type TProduct = {
  _id: Types.ObjectId | string;
  productName: string;
  productIngredients: string;
  productShortDesc: string;
  price: number;
  qty: number;
  images: ImageData[];
  tags: TTag[];
  relatedProducts?: Omit<TProduct, 'relatedProducts'>[];
};

type ProductItem = {
  productId: string;
  productName: string;
  images: ImageData[];
};

type TagItem = {
  tagId: string;
  tagName: string;
};

export interface TSearch {
  products: ProductItem[];
  tags: TagItem[];
}

export interface ProductState {
  allProducts: { products: TProduct[]; count: number | null };
  singleProduct: TProduct | null;
  searchProducts: TSearch;
  loading: boolean;
  error: { status: number | null };
}

export { fetchAllProducts, fetchSingleProduct };
export const selectAllProducts = (state: RootState) =>
  state.product.allProducts;
export const selectSingleProduct = (state: RootState) =>
  state.product.singleProduct;
export const selectSearchProducts = (state: RootState) =>
  state.product.searchProducts;
export default productSlice.reducer;
