import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { Types } from 'mongoose';
const VITE_API_URL = import.meta.env.VITE_API_URL;

const fetchAllProducts = createAsyncThunk(
  'product/fetchAllProducts',
  async (_, thunkApi) => {
    try {
      let { data }: { data: TProduct[] } = await axios.get(
        VITE_API_URL + '/api/product'
      );

      return data;
    } catch (err) {
      if (err instanceof AxiosError && err.response?.status === 404) {
        throw thunkApi.rejectWithValue({ status: err.response.status });
      }
    }
  }
);

const initialState: ProductState = {
  allProducts: [],
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
    builder
      .addCase(fetchAllProducts.fulfilled, (state, { payload }) => {
        if (!payload) return { ...initialState, error: { status: 404 } };
        state.allProducts = payload;
        state.loading = false;
        state.error.status = null;
      })
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchAllProducts.rejected,
        (state, action: PayloadAction<any>) => {
          console.log(action);
          return { ...initialState, error: { status: action.payload.status } };
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
  productDesc: string;
  brand: string;
  price: number;
  qty: number;
  imageURL: string;
  tags: TTag[];
};

export interface ProductState {
  allProducts: TProduct[];
  singleProduct: TProduct | null;
  loading: boolean;
  error: { status: number | null };
}

export { fetchAllProducts };
export default productSlice.reducer;
