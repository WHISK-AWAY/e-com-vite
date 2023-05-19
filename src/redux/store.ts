import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import productSlice from './slices/allProductSlice';
import userSlice from './slices/userSlice';
import cartSlice from './slices/cartSlice';


export const store = configureStore({
  reducer: {
    auth: authSlice,
    product: productSlice,
    user: userSlice,
    cart: cartSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// export const useAppDispatch:() => typeof store.dispatch=useDispatch;
// export const useAppSelector:TypedUseSelectorHook<ReturnType<typeof store.getState>>=useSelector;
