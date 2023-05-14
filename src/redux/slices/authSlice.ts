import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import axios from 'axios';
const VITE_API_URL = import.meta.env.VITE_API_URL;

interface AuthState {
  token: string;
  userId: string;
}

const initialState: AuthState = {
  token: '',
  userId: '',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(requestLogin.fulfilled, (state, action) => {
      state.token = action.payload!.token;
      state.userId = action.payload!.userId;
    });
  },
});

export const requestLogin = createAsyncThunk(
  'auth/requestLogin',
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
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

      return data as { token: string; userId: string };
    } catch (err) {
      console.error(err);
      // return rejectWithValue(err);
    }
  }
);

 export const selectAuth = (state:RootState) => state.auth;
export default authSlice.reducer;
