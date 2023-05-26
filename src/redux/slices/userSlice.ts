import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { TReduxError } from '../reduxTypes';
const VITE_API_URL = import.meta.env.VITE_API_URL;

export interface userState {
  user: TUser;
  loading: boolean;
  errors: TReduxError;
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

export type TEditUser = {
  userId: string;
  user: {
    firstName?: string;
    lastName?: string;
    email?: string;
    oldPassword?: string;
    password?: string;
    confirmPassword?: string;
    address?: {
      address_1?: string;
      address_2?: string;
      city?: string;
      state?: string;
      zip?: string;
    };
  };
};
/**
 * * THUNKS
 */

//* FETCH SINGLE USER
export const fetchSingleUser = createAsyncThunk(
  'singleUser/fetchSingleUser',
  async (userId: string, thunkApi) => {
    try {
      const { data }: { data: TUser } = await axios.get(
        VITE_API_URL + `/api/user/${userId}`,
        { withCredentials: true }
      );

      if (!data)
        return thunkApi.rejectWithValue({
          status: 404,
          message: 'No data returned',
        });

      return data;
    } catch (err: any) {
      if (err instanceof AxiosError)
        return thunkApi.rejectWithValue({
          status: err.response?.status,
          message: err.response?.data.message,
        });
      console.log(err);
    }
  }
);

// * EDIT USER PROFILE

export const editUserAccountInfo = createAsyncThunk(
  'singleUser/editUserAccountInfo',
  async ({ user, userId }: TEditUser, thunkApi) => {
    try {
      delete user.oldPassword;
      const { data } = await axios.put(
        VITE_API_URL + `/api/user/${userId}`,
        user,
        { withCredentials: true }
      );
      return data;
    } catch (err) {
      if (err instanceof AxiosError)
        return thunkApi.rejectWithValue({
          status: err.response?.status,
          message: err.response?.data.message,
        });
      console.log(err);
    }
  }
);

//* ADD FAVORITE
export const addToFavorites = createAsyncThunk(
  'singleUser/addToFavorites',
  async (
    { userId, productId }: { userId: string; productId: string },
    thunkApi
  ) => {
    try {
      //stuff
      const updateObject = {
        productId,
      };
      const { data } = await axios.post(
        VITE_API_URL + `/api/user/${userId}/add-favorite`,
        updateObject,
        { withCredentials: true }
      );

      return data;
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err);
        return thunkApi.rejectWithValue({
          status: err.response?.status,
          message: err.response?.data.message,
        });
      } else {
        console.error(err);
      }
    }
  }
);

//* REMOVE FAVORITE

export const removeFromFavorites = createAsyncThunk(
  'user/removeFromFavorites',
  async (
    { userId, productId }: { userId: string; productId: string },
    thunkApi
  ) => {
    try {
      const { data } = await axios.post(
        VITE_API_URL + `/api/user/${userId}/remove-favorite`,
        { productId },
        { withCredentials: true }
      );

      return data;
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err);
        return thunkApi.rejectWithValue({
          status: err.response?.status,
          message: err.response?.data.message,
        });
      } else {
        console.error(err);
      }
    }
  }
);

/**
 * * USER SLICE
 */

const initialState: userState = {
  user: {} as TUser,
  loading: false,
  errors: {
    message: null,
    status: null,
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    /**
     *  *SINGLE USER
     */

    builder
      .addCase(fetchSingleUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSingleUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload!;
        state.errors = initialState.errors;
      })
      .addCase(
        fetchSingleUser.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.errors = action.payload;
        }
      );

    /**
     * * addToFavorites
     */
    builder
      .addCase(addToFavorites.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToFavorites.fulfilled, (state, { payload }) => {
        // stuff
        state.user = payload;
        state.loading = false;
        state.errors = initialState.errors;
      })
      .addCase(addToFavorites.rejected, (state, action: PayloadAction<any>) => {
        // stuff
        console.log('addToFavorites error in addCase:', action);
        state.loading = false;
        state.errors = action.payload;
      })

      /**
       * * removeFromFavorite
       */

      .addCase(removeFromFavorites.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFromFavorites.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload;
        state.errors = initialState.errors;
      })
      .addCase(
        removeFromFavorites.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.errors = action.payload;
        }
      )
      /**
       * * EDIT USER ACCOUNT INFO
       */

      .addCase(editUserAccountInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(editUserAccountInfo.fulfilled, (state, { payload }) => {
        console.log('asscase');
        state.loading = false;
        state.user = payload;
        state.errors = initialState.errors;
      })
      .addCase(
        editUserAccountInfo.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.errors = action.payload;
        }
      );
  },
});

export default userSlice.reducer;
export const selectSingleUser = (state: RootState) => state.user;
export const selectSingleUserFavorites = (state: RootState) =>
  state.user.user.favorites;
