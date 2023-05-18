import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import axios, { AxiosError } from 'axios';
import { z } from 'zod';
import { createZodUser } from '../../../server/api/authRouter';

const VITE_API_URL = import.meta.env.VITE_API_URL;

export interface AuthState {
  token: string;
  userId: string;
  loading: boolean;
  error: { data: string; status: number | null };
}

export type UserSignUpInput = z.infer<typeof createZodUser>;

const initialState: AuthState = {
  token: '',
  userId: '',
  loading: false,
  error: { data: '', status: null },
};

export type Credentials = {
  email: string;
  password: string;
};

export interface IReturnAuth {
  token: string;
  userId: string;
}

export const requestSignUp = createAsyncThunk(
  'auth/requestSignUp',
  async (userInfo: UserSignUpInput, thunkApi) => {
    try {
      let { data }: { data: IReturnAuth } = await axios.post(
        VITE_API_URL + '/api/auth/signup',
        userInfo
      );

      if (data.token) window.localStorage.setItem('token', data.token);

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

export const requestLogin = createAsyncThunk(
  'auth/requestLogin',
  async (credentials: Credentials, thunkApi) => {
    try {
      let res: { data: IReturnAuth } = await axios.post(
        // VITE_API_URL + '/api/auth/login',
        VITE_API_URL + '/test-login',
        credentials,
        { withCredentials: true }
      );
      console.log('res from login req:', res);
      // if (data.token) window.localStorage.setItem('token', data.token);

      return res.data;
    } catch (err: any) {
      return thunkApi.rejectWithValue({
        data: err.response.data,
        status: err.response.status,
      });
    }
  }
);

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
      // console.log('fulfilled', action);
      state.token = action.payload!.token;
      state.userId = action.payload!.userId;
      state.loading = false;
      state.error = initialState.error;
    });
    builder.addCase(
      requestLogin.rejected,
      (state, action: PayloadAction<any>) => {
        // console.log('action', action);
        state.loading = false;
        state.error = {
          data: action.payload.data,
          status: action.payload.status,
        };
      }
    );
    /**
     * *requestSignUp
     */
    builder.addCase(
      requestSignUp.pending,
      (state, action: PayloadAction<any>) => {
        state.loading = true;
      }
    );
    builder.addCase(
      requestSignUp.fulfilled,
      (state, action: PayloadAction<any>) => {
        // console.log('action fuldilled', action);
        state.token = action.payload.token;
        state.userId = action.payload.userId;
        state.loading = false;
        state.error = initialState.error;
      }
    );
    builder.addCase(
      requestSignUp.rejected,
      (state, action: PayloadAction<any>) => {
        // console.log('rejected case', action);
        state.loading = false;
        state.error = {
          data: action.payload.data,
          status: action.payload.status,
        };
      }
    );
  },
});

export const selectAuth = (state: RootState) => state.auth;
export default authSlice.reducer;
