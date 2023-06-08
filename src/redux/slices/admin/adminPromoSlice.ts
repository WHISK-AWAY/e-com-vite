import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
const VITE_API_URL = import.meta.env.VITE_API_URL;
import { RootState } from '../../store';
import { startOfYesterday } from 'date-fns';

export type TPromo = {
  _id?: string;
  promoCodeName: string;
  promoRate: number | null;
};

export type TPromoState = {
  promos: TPromo[];
  singlePromo: TPromo;
  loading: boolean;
  errors: {
    status: number | null;
    message: number | null;
  };
};

const initialState: TPromoState = {
  promos: [] as TPromo[],
  singlePromo: {} as TPromo,
  loading: false,
  errors: {
    status: null,
    message: null,
  },
};

export const adminFetchAllPromos = createAsyncThunk(
  'promos/adminFetchAllPromos',
  async (_, thunkApi) => {
    try {
      const { data } = await axios.get(VITE_API_URL + '/api/promo', {
        withCredentials: true,
      });

      return data;
    } catch (err) {
      if (err instanceof AxiosError) {
        return thunkApi.rejectWithValue({
          status: err.response?.status,
          message: err.response?.data.message,
        });
      }
    }
  }
);

export const adminFetchSinglePromo = createAsyncThunk(
  'singlePromo/adminFetchSinglePromo',
  async (promoId: string, thunkApi) => {
    try {
      const { data } = await axios.get(VITE_API_URL + `/api/promo/${promoId}`, {
        withCredentials: true,
      });

      return data;
    } catch (err) {
      if (err instanceof AxiosError) {
        return thunkApi.rejectWithValue({
          status: err.response?.status,
          message: err.response?.data.message,
        });
      }
    }
  }
);

export const adminCreateSinglePromo = createAsyncThunk(
  'singlePromo/adminCreateSinglePromo',
  async (promo: TPromo, thunkApi) => {
    console.log('create promo thunk');
    try {
      console.log('create inside try promo thunk');
      const { data } = await axios.post(VITE_API_URL + '/api/promo/', promo, {
        withCredentials: true,
      });

      return data;
    } catch (err) {
      if (err instanceof AxiosError) {
        return thunkApi.rejectWithValue({
          status: err.response?.status,
          mesage: err.response?.data.message,
        });
      }
    }
  }
);

export const adminEditSinglePromo = createAsyncThunk(
  'singlePromo/adminEditSinglePromo',
  async ({ promoId, promo }: { promoId: string; promo: TPromo }, thunkApi) => {
    try {
      const { data } = await axios.put(
        VITE_API_URL + `/api/promo/${promoId}`,
        promo,
        { withCredentials: true }
      );

      return data;
    } catch (err) {
      if (err instanceof AxiosError) {
        return thunkApi.rejectWithValue({
          status: err.response?.status,
          message: err.response?.data.message,
        });
      }
    }
  }
);

export const adminDeleteSinglePromo = createAsyncThunk(
  'singlePromo/adminDeleteSinglePromo',
  async (promoId: string, thunkApi) => {
    try {
      const { data } = await axios.delete(
        VITE_API_URL + `/api/promo/${promoId}`,
        { withCredentials: true }
      );

      return data;
    } catch (err) {
      if (err instanceof AxiosError) {
        return thunkApi.rejectWithValue({
          status: err.response?.status,
          message: err.response?.data.message,
        });
      }
    }
  }
);

export type TPromoField = {
  promoCodeName: string;
  promoRate: number;
};

const adminPromoSlice = createSlice({
  name: 'promo',
  initialState,
  reducers: {
    sort: (
      state,
      {
        payload: { column, sortDir },
      }: { payload: { column: keyof TPromoField; sortDir: string } }
    ) => {
      return {
        ...state,

        promos: [...state.promos].sort((a: any, b: any) => {
          if (sortDir === 'desc' && column === 'promoCodeName') {
            return a.promoCodeName > b.promoCodeName ? 1 : -1;
          }
          if (sortDir === 'asc' && column === 'promoCodeName') {
            return a.promoCodeName < b.promoCodeName ? 1 : -1;
          }
          if (sortDir === 'desc' && column === 'promoRate') {
            return b.promoRate - a.promoRate;
          }
          if (sortDir === 'asc' && column === 'promoRate') {
            return a.promoRate - b.promoRate;
          }
          return 1;
        }),
      };
    },
  },
  extraReducers: (builder) => {
    /**
     * *FETCH ALL PROMOS
     */
    builder
      .addCase(adminFetchAllPromos.pending, (state) => {
        state.loading = true;
      })
      .addCase(adminFetchAllPromos.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.promos = payload;
        state.errors = { ...initialState.errors };
      })
      .addCase(
        adminFetchAllPromos.rejected,
        (state, { payload }: PayloadAction<any>) => {
          state.loading = false;
          state.errors = payload;
        }
      )

      /**
       * * FETCH SINGLE PROMOS
       */

      .addCase(adminFetchSinglePromo.pending, (state) => {
        state.loading = true;
      })
      .addCase(adminFetchSinglePromo.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.singlePromo = payload;
        state.errors = { ...initialState.errors };
      })
      .addCase(
        adminFetchSinglePromo.rejected,
        (state, { payload }: PayloadAction<any>) => {
          state.loading = false;
          state.errors = payload;
        }
      )

      /**
       * *CREATE NEW PROMO
       */

      .addCase(adminCreateSinglePromo.pending, (state) => {
        state.loading = true;
      })
      .addCase(adminCreateSinglePromo.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.singlePromo = payload;
        state.errors = { ...initialState.errors };
      })
      .addCase(
        adminCreateSinglePromo.rejected,
        (state, { payload }: PayloadAction<any>) => {
          state.loading = false;
          state.errors = payload;
        }
      )

      /**
       * *EDIT PROMO
       */
      .addCase(adminEditSinglePromo.pending, (state) => {
        state.loading = false;
      })
      .addCase(adminEditSinglePromo.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.singlePromo = payload;
        state.errors = { ...initialState.errors };
      })
      .addCase(
        adminEditSinglePromo.rejected,
        (state, { payload }: PayloadAction<any>) => {
          state.loading = false;
          state.errors = payload;
        }
      )

      /**
       * *DELETE PROMO
       */
      .addCase(adminDeleteSinglePromo.pending, (state) => {
        state.loading = true;
      })
      .addCase(adminDeleteSinglePromo.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.singlePromo = payload;
        state.errors = { ...initialState.errors };
      })
      .addCase(
        adminDeleteSinglePromo.rejected,
        (state, { payload }: PayloadAction<any>) => {
          state.loading = false;
          state.errors = payload;
        }
      );
  },
});

export default adminPromoSlice.reducer;
export const {sort} = adminPromoSlice.actions;
export const selectAdminPromos = (state: RootState) => state.adminPromo;
export const selectAdminSinglePromo = (state: RootState) =>
  state.adminPromo.singlePromo;
