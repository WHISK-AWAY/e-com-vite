import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import axios, { AxiosError } from 'axios';
import { z } from 'zod';
import { createZodUser } from '../../../server/api/authRouter';

const VITE_API_URL = import.meta.env.VITE_API_URL;

/**
 * * TYPES/INTERFACES
 */
const initialState: AuthState = {
  userId: null,
  firstName: null,
  loading: false,
  error: { data: null, status: null },
};

export type AuthState = {
  firstName: string | null;
  userId: string | null;
  loading: boolean;
  error: {
    data: string | null;
    status: number | null;
  };
};

export type UserSignUpInput = z.infer<typeof createZodUser>;

export type Credentials = {
  email: string;
  password: string;
};

/**
 * * THUNKS
 */

// * Register / request signup

export const requestSignUp = createAsyncThunk(
  'auth/requestSignUp',
  async (userInfo: UserSignUpInput, thunkApi) => {
    try {
      let { data }: { data: AuthState } = await axios.post(
        VITE_API_URL + '/api/auth/signup',
        userInfo,
        { withCredentials: true }
      );

      return data;
    } catch (err: any) {
      console.dir(err);
      if (err instanceof AxiosError) {
        throw thunkApi.rejectWithValue({
          data: err.response?.data,
          status: err.response?.status,
        });
      }
      throw err();
    }
  }
);

// * Log in

export const requestLogin = createAsyncThunk(
  'auth/requestLogin',
  async (credentials: Credentials, thunkApi) => {
    try {
      let res: { data: AuthState } = await axios.post(
        // VITE_API_URL + '/api/auth/login',
        VITE_API_URL + '/api/auth/login',
        credentials,
        { withCredentials: true }
      );

      return res.data;
    } catch (err: any) {
      console.log('requestLogin err:', err);
      return thunkApi.rejectWithValue({
        data: err.response.data,
        status: err.response.status,
      });
    }
  }
);

//* GET USER ID
export const getUserId = createAsyncThunk(
  'auth/getUserId',
  async (_, thunkApi) => {
    try {
      const { data }: { data: { userId: string } } = await axios.get(
        VITE_API_URL + '/api/auth/get-user-id',
        { withCredentials: true }
      );

      return { data };
    } catch (err) {
      thunkApi.rejectWithValue(err);
    }
  }
);

// * Log out

export const requestLogout = createAsyncThunk(
  'auth/requestLogout',
  async (_, thunkApi) => {
    try {
      await axios.post(
        VITE_API_URL + '/api/auth/logout',
        {},
        { withCredentials: true }
      );

      return null;
    } catch (err) {
      console.log('logout error: ', err);
      return thunkApi.rejectWithValue({ error: 'Error with logout request' });
    }
  }
);

/**
 * * AUTH SLICE
 */

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    /**
     * * requestLogin
     */
    builder.addCase(requestLogin.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(requestLogin.fulfilled, (state, action) => {
      return action.payload;
    });
    builder.addCase(
      requestLogin.rejected,
      (state, action: PayloadAction<any>) => {
        return {
          ...initialState,
          error: {
            data: action.payload.data,
            status: action.payload.status,
          },
        };
      }
    );
    /**
     * *requestSignUp
     */
    builder.addCase(requestSignUp.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(requestSignUp.fulfilled, (state, action) => {
      return action.payload;
    });
    builder
      .addCase(requestSignUp.rejected, (state, action: PayloadAction<any>) => {
        return {
          ...initialState,
          error: {
            data: action.payload.data,
            status: action.payload.status,
          },
        };
      })

      /**
       * * GET USER ID
       */

      .addCase(getUserId.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getUserId.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.userId = payload!.data.userId;
        state.error = { ...initialState.error };
      })
      .addCase(getUserId.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });

    /**
     * * Request logout
     */
    builder
      .addCase(requestLogout.pending, (state) => {
        state.loading = true;
      })
      .addCase(requestLogout.fulfilled, (state) => {
        return { ...initialState };
      })
      .addCase(requestLogout.rejected, (state, action: PayloadAction<any>) => {
        return {
          ...initialState,
          error: {
            data: action.payload.data,
            status: action.payload.status,
          },
        };
      });
  },
});

export const selectAuth = (state: RootState) => state.auth;
export default authSlice.reducer;

/**
 * ? how do we deal with guest carts...?
 *  can cart info be stored w/session?
 *  does session hold steady for a given non-logged-in user?
 *  can we automatically create a guest user when guest adds item to cart?
 */
