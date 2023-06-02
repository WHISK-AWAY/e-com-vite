import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { RootState } from '../store';
const VITE_API_URL = import.meta.env.VITE_API_URL;

export type TPromoCode = {
  promoCodeName: string;
  promoRate: number;
};

type PromoState = {
  promoCode: TPromoCode;
  loading: boolean;
  errors: {
    status: null | number;
    message: null | string;
  };
};

const initialState: PromoState = {
  promoCode: {} as TPromoCode,
  loading: false,
  errors: {
    status: null,
    message: null,
  },
};

export const fetchSinglePromo = createAsyncThunk(
  'promo/fetchSinglePromo',
  async (promoName: string, thunkApi) => {
    try {
      const { data } = await axios.get(
        VITE_API_URL + `/api/promo/check-promo/${promoName}`,
        { withCredentials: true }
      );

      return data;
    } catch (err) {
      if (err instanceof AxiosError) {
        return thunkApi.rejectWithValue({
          message: err.response?.data.message,
          status: err.response?.status,
        });
      }
    }
  }
);

const promoSlice = createSlice({
  name: 'promoCode',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSinglePromo.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSinglePromo.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.promoCode = payload;
        state.errors = { ...initialState.errors };
      })
      .addCase(
        fetchSinglePromo.rejected,
        (state, { payload }: PayloadAction<any>) => {
          state.loading = false;
          state.errors = payload;
        }
      );
  },
});

export default promoSlice.reducer;
export const selectPromo = (state: RootState) => state.promoCode.promoCode;
export const selectPromoErrors = (state: RootState) => state.promoCode.errors;
