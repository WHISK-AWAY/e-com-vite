import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import axios from 'axios';
import { z } from 'zod';
import { createZodUser } from '../../../server/api/authRouter';

const VITE_API_URL = import.meta.env.VITE_API_URL;

export interface AuthState {
  token: string;
  userId: string;
  loading: boolean;
  error: string;
}

export type UserSignUpInput = z.infer<typeof createZodUser>;

const initialState: AuthState = {
  token: '',
  userId: '',
  loading: false,
  error: '',
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

      let {data}: {data: IReturnAuth} = await axios.post(VITE_API_URL + '/api/auth/signup', userInfo);

      if(data.token) 
        window.localStorage.setItem('token', data.token);

      return data;
    } catch (err: any) {
      return thunkApi.rejectWithValue(err.message);
    }
  }
);


export const requestLogin = createAsyncThunk(
  'auth/requestLogin',
  async (credentials: Credentials, thunkApi) => {
    try {
      let { data }: { data: IReturnAuth } = await axios.post(
        VITE_API_URL + '/api/auth/login',
        credentials
      );

      if (data.token)
        window.localStorage.setItem('token', data.token);

        // console.log('TOKEN',typeof data.token)
      return data;
    } catch (err: any) {
      // return console.error(err);
      return thunkApi.rejectWithValue(err.message);
      // return rejectWithValue(err);
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
        // console.log('action', action);
        (state.loading = false),
          // state.error = action.error.messag || 'Something went wrong'
          (state.error = action.payload);
      });
    /**
     * *requestSignUp
     */
    builder.addCase(requestSignUp.pending, (state, action:PayloadAction<any>) => {
      state.loading = true;
    });
    builder.addCase(requestSignUp.fulfilled, (state, action:PayloadAction<any>) => {
      state.token= action.payload.token;
      state.userId = action.payload.userId;
      state.loading= false;
      state.error = ''
    });
    builder.addCase(requestSignUp.rejected, (state, action:PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    })
  },
});

export const selectAuth = (state: RootState) => state.auth;
export default authSlice.reducer;
