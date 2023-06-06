import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import productSlice from './slices/allProductSlice';
import userSlice from './slices/userSlice';
import cartSlice from './slices/cartSlice';
import orderSlice from './slices/orderSlice';
import reviewSlice from './slices/reviewSlice';
import tagSlice from './slices/tagSlice';
import promoSlice from './slices/promoCodeSlice';
import adminReviewsSlice from './slices/admin/reviewsAdminSlice';
import adminReportSlice from './slices/admin/reportsAdminSlice';
import adminProductSlice from './slices/admin/productsSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    product: productSlice,
    user: userSlice,
    cart: cartSlice,
    order: orderSlice,
    review: reviewSlice,
    tag: tagSlice,
    promoCode: promoSlice,
    adminReviews: adminReviewsSlice,
    reports: adminReportSlice,
    adminProducts: adminProductSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
