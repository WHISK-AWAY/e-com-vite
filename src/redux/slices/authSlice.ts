import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import axios from 'axios';
import { z } from 'zod';
import { createZodUser } from '../../../server/api/authRouter';

const VITE_API_URL = import.meta.env.VITE_API_URL;

interface AuthState {
  firstName: string;
  userId: string;
  loading: boolean;
  error: string;
}

export type UserSignUpInput = z.infer<typeof createZodUser>;

const initialState: AuthState = {
  firstName: '',
  userId: '',
  loading: false,
  error: '',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(requestLogin.fulfilled, (state, action) => {
        state.firstName = action.payload!.firstName;
        state.userId = action.payload!.userId;
      })
      .addCase(testing.fulfilled, (state, action) => {
        console.log('action:', action);
        return state;
      });
  },
});

export const requestLogin = createAsyncThunk(
  'auth/requestLogin',
  async (credentials: { email: string; password: string }) => {
    try {
      const { email, password } = credentials;
      let { data } = await axios.post(VITE_API_URL + '/api/auth/test-login', {
        email,
        password,
      });

      // if (data.token)
      //   window.localStorage.setItem('token', JSON.stringify(data.token));
      // console.log('data', data);

      return data as { firstName: string; userId: string };
    } catch (err) {
      console.error(err);
      // return rejectWithValue(err);
    }
  }
);

export const testing = createAsyncThunk('auth/testing', async () => {
  try {
    const res = await axios.get(VITE_API_URL + '/api/user');
    console.log('res.data @ testing thunk:', res.data);
    return null;
  } catch (err) {
    console.log(err);
    throw err;
  }
});

export const selectAuth = (state: RootState) => state.auth;
export default authSlice.reducer;
