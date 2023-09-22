import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import axios, { AxiosError } from 'axios';

import type { ReviewSortFields } from '../../../components/Admin/AdminReviews';
import { ImageData } from '../../../../server/database';

const VITE_API_URL = import.meta.env.VITE_API_URL;

/**
 * * TYPES
 */

export type TAdminReview = {
  _id: string;
  product: {
    _id: string;
    productName: string;
    productIngredients: string;
    productShortDesc: string;
    price: number;
    qty: number;
    images: ImageData;
    tags: string[];
    saleCount: number;
  };
  title: string;
  content: string;
  date: Date;
  rating: {
    overall: number;
    quality: number;
    value: number;
  };
  skinConcernOptions: {
    value: string;
    label: string;
  }[];
  user: string; //userId
  nickname: string;
  location: string;
  verifiedPurchase: boolean;
  upvote: number;
  downvote: number;
};

export type TAdminReviewsState = {
  allReviews: TAdminReview[];
  singleReview: TAdminReview | null;
  loading: boolean;
  errors: {
    message: string | null;
    status: number | null;
  };
};

/**
 * * THUNKS
 */

export const fetchAllAdminReviews = createAsyncThunk(
  'adminReview/fetchAllReviews',
  async (_, thunkApi) => {
    try {
      const { data } = await axios.get(VITE_API_URL + '/api/admin-review', {
        withCredentials: true,
      });
      return data;
    } catch (err) {
      if (err instanceof AxiosError) {
        return thunkApi.rejectWithValue({
          message: err.response?.data.message,
          status: err.response?.status,
        });
      }
      console.error('ERROR AT adminReview/fetchAllReviews:', err);
    }
  }
);

export const deleteReview = createAsyncThunk(
  'adminReview/deleteReview',
  async ({ reviewId }: { reviewId: string }, thunkApi) => {
    try {
      const { data } = await axios.delete(
        VITE_API_URL + `/api/admin-review/${reviewId}`,
        { withCredentials: true }
      );

      return { deletedReviewId: reviewId };
    } catch (err) {
      if (err instanceof AxiosError) {
        return thunkApi.rejectWithValue({
          message: err.response?.data.message,
          status: err.response?.status,
        });
      }
      console.error('ERROR AT adminReview/deleteReview:', err);
    }
  }
);

/**
 * * SLICE
 */

const initialState: TAdminReviewsState = {
  allReviews: [],
  singleReview: null,
  loading: false,
  errors: {
    message: null,
    status: null,
  },
};

const adminReviewSlice = createSlice({
  name: 'adminReviews',
  initialState,
  reducers: {
    resetAdminState: () => initialState,

    /**
     * * Sort Reviews
     *   lots of options for sort fields, and they don't all work the same due to nestedness / type
     */
    sortReviews: (
      state,
      {
        payload: { sortField, sortDir },
      }: { payload: { sortField: keyof ReviewSortFields; sortDir: string } }
    ) => {
      const { allReviews } = state;
      if (!allReviews.length) return state;

      if (sortField === 'productName') {
        return {
          ...state,
          allReviews: [...allReviews].sort((a, b) => {
            if (sortDir === 'asc') {
              return a.product[sortField] >= b.product[sortField] ? 1 : -1;
            } else {
              return b.product[sortField] >= a.product[sortField] ? 1 : -1;
            }
          }),
        };
      } else if (sortField === 'content') {
        return {
          ...state,
          allReviews: [...allReviews].sort((a, b) => {
            if (sortDir === 'asc') {
              return b[sortField].length - a[sortField].length;
            } else {
              return a[sortField].length - b[sortField].length;
            }
          }),
        };
      } else if (['upvote', 'downvote'].includes(sortField)) {
        return {
          ...state,
          allReviews: [...allReviews].sort((a: any, b: any) => {
            // intentional 'any' type
            if (sortDir === 'asc') {
              return b[sortField] - a[sortField];
            } else {
              return a[sortField] - b[sortField];
            }
          }),
        };
      } else {
        return {
          ...state,
          allReviews: [...allReviews].sort((a: any, b: any) => {
            // intentional 'any' type
            if (sortDir === 'asc') {
              return a[sortField] >= b[sortField] ? 1 : -1;
            } else {
              return b[sortField] >= a[sortField] ? 1 : -1;
            }
          }),
        };
      }
    },
  },
  extraReducers: (builder) => {
    /**
     * * Fetch All Reviews
     */
    builder
      .addCase(fetchAllAdminReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllAdminReviews.fulfilled, (state, { payload }) => {
        return {
          ...state,
          errors: initialState.errors,
          loading: false,
          allReviews: payload,
        };
      })
      .addCase(
        fetchAllAdminReviews.rejected,
        (_, { payload }: PayloadAction<any>) => {
          return { ...initialState, errors: payload };
        }
      );

    /**
     * * Delete Review
     */
    builder
      .addCase(deleteReview.pending, (state) => {
        // do stuff
        return { ...state, loading: true };
      })
      .addCase(deleteReview.fulfilled, (state, { payload }) => {
        // do stuff
        return {
          ...initialState,
          allReviews: state.allReviews.filter(
            (review) => review._id !== payload?.deletedReviewId
          ),
        };
      })
      .addCase(
        deleteReview.rejected,
        (state, { payload }: PayloadAction<any>) => {
          // do stuff
          return { ...state, errors: payload };
        }
      );
  },
});

export const selectAdminReviewsState = (state: RootState) => state.adminReviews;
export const selectAllAdminReviews = (state: RootState) =>
  state.adminReviews.allReviews;
export const selectSingleAdminReview = (state: RootState) =>
  state.adminReviews.singleReview;

export const { sortReviews, resetAdminState } = adminReviewSlice.actions;

export default adminReviewSlice.reducer;
