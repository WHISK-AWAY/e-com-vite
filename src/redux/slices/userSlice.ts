import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
const VITE_API_URL = import.meta.env.VITE_API_URL;



export interface userState {
  user: TUser;
  loading: boolean;
  errors: {};
}

export type TProduct = {
  _id: string;
  productName: string;
  productLongDesc: string;
  productShortDesc: string;
  brand: string;
  price: number;
  qty: number;
  imageURL: string;
  tags: {
    _id: string;
    tagName: string;
  }[];
};

export type TUser = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  address?: {
    address_1: string;
    address_2?: string;
    city: string;
    state: string;
    zip: string;
  };
  favorites: TProduct[];
  cart: {
    products: {
      product: TProduct;
      price: number;
      qty: number;
      _id: string;
    }[];
    subtotal: number;
  };
  role: string;
  reviewCount: number;
  voteCount: number;
  skinConcerns: string[];
};

const initialState: userState = {
  user: {} as TUser,
  loading: false,
  errors: {}
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {

    /**
     *  *SINGLE USER
     */

    builder.addCase(fetchSingleUser.pending, (state) => {
      state.loading = true;
    })
    .addCase(fetchSingleUser.fulfilled, (state, {payload} ) => {
      state.loading = false;
      state.user = payload;
      state.errors = {}
    })
    .addCase(fetchSingleUser.rejected, (state, action:PayloadAction<any>) => {
      state.loading = false;
      state.errors = action.payload;
    })
  }
})


export const fetchSingleUser = createAsyncThunk('singleUser/fetchSingleUser', async(userId: string, thunkApi) => {
  try{
    const {data}: {data: TUser} = await axios.get(VITE_API_URL + `/api/user/${userId}`, {withCredentials: true});


    return data;
  }catch(err: any) {
    return thunkApi.rejectWithValue(err);
  }
} )


export default userSlice.reducer;
export const selectSingleUser = (state: RootState) => state.user;