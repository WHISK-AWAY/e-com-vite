import axios from 'axios';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
const VITE_API_URL = import.meta.env.VITE_API_URL;

export interface IReviewState {
  _id: string;
  product: {
    _id: string;
  };
  title: string;
  content: string;
  date: string;
  rating: {
    overall: number;
    quality: number;
    value: number;
  };
  user: {
    _id: string;
    voteCount: number;
    reviewCount: number;
    skinConcernOptions: {
      value: string;
      label: string;
    };
  };
  skinConcernOptions: {
    value: string;
    label: string;
  }[];
  nickname?: string;
  location?: string;
  verifiedPurchase?: boolean;
  upvote?: number;
  downvote?: number;
}

export type TAddNewReview = {
  title: string;
  content: string;
  rating: {
    overall: number;
    quality: number;
    value: number;
  };
  skinConcernOptions: {
    value: string;
    label: string;
  }[];
  nickname: string;
  location: string;
};
export type TReviewState = {
  reviews: IReviewState[];
  loading: boolean;
  errors: {};
};

export const fetchAllReviews = createAsyncThunk(
  'review/fetchAllReviews',
  async (productId: string, thunkApi) => {
    try {
      const { data } = await axios.get(
        VITE_API_URL + `/api/product/${productId}/review`,
        { withCredentials: true }
      );

      // console.log('dataR', data);
      return data;
    } catch (err) {
      return thunkApi.rejectWithValue(err);
    }
  }
);

export const addReview = createAsyncThunk(
  'review/addReview',
  async (
    {
      userId,
      productId,
      review,
    }: { userId: string; productId: string; review: TAddNewReview },
    thunkApi
  ) => {
    try {
      console.log('hi');
      const { data } = await axios.post(
        VITE_API_URL + `/api/product/${productId}/review`,
        review,
        { withCredentials: true }
      );

      // console.log('data fom add review', data);

      return data;
    } catch (err) {
      return thunkApi.rejectWithValue(err);
    }
  }
);

export const deleteReview = createAsyncThunk(
  'review/deleteReview',
  async (
    {
      userId,
      reviewId,
      productId,
    }: { userId: string; reviewId: string; productId: string },
    thunkApi
  ) => {
    try {
      const { data } = await axios.delete(
        VITE_API_URL + `/api/product/${productId}/review/${reviewId}`,
        { withCredentials: true }
      );

      return reviewId;
    } catch (err) {
      return thunkApi.rejectWithValue(err);
    }
  }
);

export const upvoteReview = createAsyncThunk(
  'review/upvoteReview',
  async (
    { reviewId, productId }: { reviewId: string; productId: string },
    thunkApi
  ) => {
    try {
      const { data } = await axios.post(
        VITE_API_URL + `/api/product/${productId}/review/${reviewId}/upvote`,
        {},
        { withCredentials: true }
      );

      // console.log('upvote data', data);

      return data;
    } catch (err) {
      return thunkApi.rejectWithValue(err);
    }
  }
);

export const downvoteReview = createAsyncThunk(
  'review/downvoteReview',
  async (
    { reviewId, productId }: { reviewId: string; productId: string },
    thunkApi
  ) => {
    try {
      const { data } = await axios.post(
        VITE_API_URL + `/api/product/${productId}/review/${reviewId}/downvote`,
        {},
        { withCredentials: true }
      );

      return data;
    } catch (err) {
      return thunkApi.rejectWithValue(err);
    }
  }
);
const initialState: TReviewState = {
  reviews: [] as IReviewState[],
  loading: false,
  errors: {},
};

const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    /**
     * * FETCH ALL REVIEWS
     */
    builder
      .addCase(fetchAllReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllReviews.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.reviews = payload;
        state.errors = { ...initialState.errors };
      })
      .addCase(
        fetchAllReviews.rejected,
        (state, { payload }: PayloadAction<any>) => {
          state.loading = false;
          state.errors = payload;
        }
      )

      /**
       * * ADD REVIEW
       */

      .addCase(addReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(addReview.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.reviews = payload;
        state.errors = { ...initialState.errors };
      })
      .addCase(addReview.rejected, (state, { payload }: PayloadAction<any>) => {
        state.loading = false;
        state.errors = payload;
      })

      /**
       * * DELETE REVEIW
       */

      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteReview.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.reviews = state.reviews.filter((review) => {
          return review._id !== payload;
        });
        state.errors = { ...initialState.errors };
      })
      .addCase(
        deleteReview.rejected,
        (state, { payload }: PayloadAction<any>) => {
          state.loading = false;
          state.errors = payload;
        }
      )
      /**
       * * UPVOTE REVIEW
       */

      .addCase(upvoteReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(upvoteReview.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.reviews = payload;
        state.errors = { ...initialState.errors };
      })
      .addCase(
        upvoteReview.rejected,
        (state, { payload }: PayloadAction<any>) => {
          state.loading = false;
          state.errors = payload;
        }
      )

      /**
       * * DOWNVOTE REVIEW
       */
      .addCase(downvoteReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(downvoteReview.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.reviews = payload;
        state.errors = { ...initialState.errors };
      })
      .addCase(
        downvoteReview.rejected,
        (state, { payload }: PayloadAction<any>) => {
          state.loading = false;
          state.errors = payload;
        }
      );
  },
});

export const selectReviewState = (state: RootState) => state.review;
export default reviewSlice.reducer;
