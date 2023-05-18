import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import productSlice from './slices/allProductSlice';
//import {useSelector, useDispatch, TypedUseSelectorHook} from 'react-redux';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    product: productSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// export const useAppDispatch:() => typeof store.dispatch=useDispatch;
// export const useAppSelector:TypedUseSelectorHook<ReturnType<typeof store.getState>>=useSelector;
