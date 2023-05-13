import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface AuthState {
  token: string;
  userId: string;
}

const initialState: AuthState = {
  token: '',
  userId: ''
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  extraReducers: {
    
  }
})