import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import axios from 'axios';
import { add } from 'date-fns';
const VITE_API_URL = import.meta.env.VITE_API_URL;

export interface ICart {
  cart: {
    products: {
      product: TProduct
      price: number;
      qty: number;
      _id: string;
    }[],
    subtotal: number;
  };
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

export type CartState ={ 
  cart: ICart,
  loading: boolean,
  errors: {data: string, status: number | null}
}
const initialState: CartState = {
  cart: {} as ICart,
  loading: false,
  errors: {data: '', status: null}
}


const cartSlice = createSlice({
  name: "cart", 
  initialState, 
  reducers: {},
  extraReducers: (builder) => {

    /**
     * * FETCH USER CART
     */
    builder.addCase(fetchUserCart.pending, (state, action) => {
      state.loading = true;
    })
    .addCase(fetchUserCart.fulfilled, (state, {payload} ) => {
      state.loading = false;
      state.cart = payload;
      state.errors = {...initialState.errors}
    })
    .addCase(fetchUserCart.rejected, (state, action:PayloadAction<any>) => {
      state.loading = false;
      state.errors = action.payload;
    })

    /**
     * *ADD ITEM TO CART
     */

    .addCase(addToCart.pending, (state, action) => {
      state.loading = true;
    })
    .addCase(addToCart.fulfilled, (state, {payload}) => {
      state.loading = false;
      state.cart = payload;
      state.errors = {...initialState.errors}
    })
    .addCase(addToCart.rejected, (state, action:PayloadAction<any>) => {
      state.loading = false;
      state.errors = action.payload;
    })
  }
})

export const fetchUserCart = createAsyncThunk('cart/fetchUserCart', async(userId: string, thunkApi) => {
  try{
    const token = window.localStorage.getItem('token');

    if(!token) throw thunkApi.rejectWithValue({err: 'no token:('})

    const {data} = await axios.get(VITE_API_URL + `/api/user/${userId}/cart`, {headers: {authorization: token}});

    // console.log('cart', data);
    return data;
  }catch(err) {
    return thunkApi.rejectWithValue(err);
  }
})


export const addToCart = createAsyncThunk('cart/addToCart', async(userId:string, thunkApi) => {
  try{
    const token = window.localStorage.getItem('token');
    if(!token) throw thunkApi.rejectWithValue({err: 'no token'});


    const {data} = await axios.post(VITE_API_URL + `/api/user/${userId}/cart/add-item`, {headers: {authorization: token}});

    console.log('data additem', data);
    return data;
  }catch(err) {
    thunkApi.rejectWithValue(err);
  }
})

export const selectCart = (state:RootState) => state.cart;
export default cartSlice.reducer;