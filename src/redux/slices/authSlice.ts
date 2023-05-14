import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import axios from 'axios';
import { string } from 'zod';
const VITE_API_URL = import.meta.env.VITE_API_URL;

export interface AuthState {
  token: string;
  userId: string;
  loading: boolean;
  error: string;
}

export interface User {
  email: string;
  password: string;
}

const initialState: AuthState = {
  token: '',
  userId: '',
  loading: false,
  error: '',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(requestLogin.pending, (state, action) => {
      state.loading = true;
    }); //cannot figure out how to assign payloadaction type to action, keep erroring
    builder.addCase(requestLogin.fulfilled, (state, action) => {
      state.token = action.payload!.token;
      state.userId = action.payload!.userId;
      // state.data = action.payload;
      state.loading = false;
      // state.error = '' || 'Something went wrong'
    });
    builder.addCase(
      requestLogin.rejected,
      (state, action: PayloadAction<any>) => {
        (state.loading = false),
          // state.error = action.error.messag || 'Something went wrong'
          (state.error = action.payload);
      }
    );
  },
});

export const requestLogin = createAsyncThunk(
  'auth/requestLogin',
  async (
    credentials: { email: string; password: string },
    //tried using thunkApi to make rejectWithValue work but no luck
    thunkApi
  ): Promise<AuthState | void> => {
    try {
      const { email, password } = credentials;
      let { data } = await axios.post(VITE_API_URL + '/api/auth/login', {
        email,
        password,
      });

      if (data.token)
        window.localStorage.setItem('token', JSON.stringify(data.token));
      console.log('data', data);

      return data;
    } catch (err: any) {
      return console.error(err);
      // return thunkApi.rejectWithValue(err.message)
      // return rejectWithValue(err);
    }
  }
);

export const selectAuth = (state: RootState) => state.auth;
export default authSlice.reducer;
