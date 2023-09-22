import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import axios, { AxiosError } from 'axios';
import { z } from 'zod';
import { createZodUser } from '../../../server/api/authRouter';
import { toastUserLoggedIn, toastUserLoggedOut } from '../../utilities/toast';

const VITE_API_URL = import.meta.env.VITE_API_URL;

/**
 * * TYPES/INTERFACES
 */

export type AuthState = {
  firstName: string | null;
  userId: string | null;
  loading: boolean;
  error: {
    message: string | null;
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

// * requestSignUp

export const requestSignUp = createAsyncThunk(
  'auth/requestSignUp',
  async (userInfo: UserSignUpInput, thunkApi) => {
    try {
      let { data }: { data: AuthState } = await axios.post(
        VITE_API_URL + '/api/auth/signup',
        userInfo,
        { withCredentials: true }
      );
      // console.log('signup thunk data received', data);
      return data;
    } catch (err: any) {
      if (err instanceof AxiosError)
        return thunkApi.rejectWithValue({
          status: err.response?.status,
          message: err.response?.data.message,
        });
      else console.error(err);
    }
  }
);

// * requestLogin

export const requestLogin = createAsyncThunk(
  'auth/requestLogin',
  async (credentials: Credentials, thunkApi) => {
    try {
      let res: { data: AuthState } = await axios.post(
        VITE_API_URL + '/api/auth/login',
        credentials,
        { withCredentials: true }
      );

      if (res.data.firstName) toastUserLoggedIn(res.data.firstName);

      return res.data;
    } catch (err: any) {
      // console.log('requestLogin err:', err);
      if (err instanceof AxiosError)
        return thunkApi.rejectWithValue({
          status: err.response?.status,
          message: err.response?.data.message,
        });
      else console.error(err);
    }
  }
);

//* getUserId

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
      if (err instanceof AxiosError)
        return thunkApi.rejectWithValue({
          status: err.response?.status,
          message: err.response?.data.message,
        });
      else console.error(err);
    }
  }
);

// * requestLogout

export const requestLogout = createAsyncThunk(
  'auth/requestLogout',
  async (_, thunkApi) => {
    try {
      await axios.post(
        VITE_API_URL + '/api/auth/logout',
        {},
        { withCredentials: true }
      );

      toastUserLoggedOut();
      return null;
    } catch (err) {
      if (err instanceof AxiosError)
        return thunkApi.rejectWithValue({
          status: err.response?.status,
          message: err.response?.data.message,
        });
      else console.error(err);
    }
  }
);

/**
 * * AUTH SLICE
 */

const initialState: AuthState = {
  userId: null,
  firstName: null,
  loading: false,
  error: { message: null, status: null },
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    /**
     * * requestLogin
     */

    builder
      .addCase(requestLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(requestLogin.fulfilled, (_, action) => {
        return action.payload;
      })
      .addCase(requestLogin.rejected, (_, action: PayloadAction<any>) => {
        return { ...initialState, error: action.payload };
      });

    /**
     * * requestSignUp
     */

    builder
      .addCase(requestSignUp.pending, (state) => {
        state.loading = true;
      })
      .addCase(requestSignUp.fulfilled, (_, action) => {
        return action.payload;
      })
      .addCase(requestSignUp.rejected, (_, action: PayloadAction<any>) => {
        return { ...initialState, error: action.payload };
      })

      /**
       * * getUserId
       */

      .addCase(getUserId.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserId.fulfilled, (state, { payload }) => {
        // console.log('get uid fulfilled: ', payload);
        state.loading = false;
        // console.log('payload', payload)
        state.userId = payload!.data.userId;
        state.error = initialState.error;
      })
      .addCase(getUserId.rejected, (_, action: PayloadAction<any>) => {
        return { ...initialState, error: action.payload };
      });

    /**
     * * requestLogout
     */

    builder
      .addCase(requestLogout.pending, () => {
        return { ...initialState, loading: true };
      })
      .addCase(requestLogout.fulfilled, () => {
        return { ...initialState };
      })
      .addCase(requestLogout.rejected, (_, action: PayloadAction<any>) => {
        return { ...initialState, error: action.payload };
      });
  },
});

export const selectAuth = (state: RootState) => state.auth;
export const selectAuthUserId = (state: RootState) => state.auth.userId;
export default authSlice.reducer;
