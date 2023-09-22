import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
const VITE_API_URL = import.meta.env.VITE_API_URL;
import { TTag } from '../tagSlice';
import { RootState } from '../../store';
import { TCreateTag } from '../../../components/Admin/tags/CreateOrEditTag';

export type TagState = {
  tags: TTag[];
  singleTag: {};
  loading: boolean;
  errors: {
    status: number | null;
    message: string | null;
  };
};

const initialState: TagState = {
  tags: [] as TTag[],
  singleTag: {},
  loading: false,
  errors: {
    status: null,
    message: null,
  },
};

export const adminFetchAllTags = createAsyncThunk(
  'tags/adminFetchAllTags',
  async (_, thunkApi) => {
    try {
      const { data } = await axios.get(VITE_API_URL + '/api/tag', {
        withCredentials: true,
        params: { 'return-all': true },
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

export const createSingleTag = createAsyncThunk(
  'singleTag/createSingleTag',
  async (tagName: string, thunkApi) => {
    try {
      const { data } = await axios.post(
        VITE_API_URL + '/api/tag',
        { tagName },
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

export const editSingleTag = createAsyncThunk(
  'singleTag/editSingleTag',
  async ({ tag, tagId }: { tag: TCreateTag; tagId: string }, thunkApi) => {
    try {
      const { data } = await axios.put(
        VITE_API_URL + `/api/tag/${tagId}`,
        tag,
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

export const deleteSingleTag = createAsyncThunk(
  'singleTag/deleteSingleTag',
  async (tagId: string, thunkApi) => {
    try {
      const { data } = await axios.delete(VITE_API_URL + `/api/tag/${tagId}`, {
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

const adminTagSlice = createSlice({
  name: 'tag',
  initialState,
  reducers: {
    sort: (
      state,
      {
        payload: { column, sortDir },
      }: { payload: { column: string; sortDir: string } }
    ) => {
      return {
        ...state,
        tags: [...state.tags].sort((a: any, b: any) => {
          if (sortDir === 'desc' && column === 'tagName') {
            return a.tagName > b.tagName ? 1 : -1;
          } else {
            return a.tagName < b.tagName ? 1 : -1;
          }
        }),
      };
    },
  },
  extraReducers: (builder) => {
    builder

      /**
       * * FETCH ALL TAGS
       */

      .addCase(adminFetchAllTags.pending, (state) => {
        state.loading = true;
      })
      .addCase(adminFetchAllTags.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.tags = payload;
        state.errors = { ...initialState.errors };
      })
      .addCase(
        adminFetchAllTags.rejected,
        (state, { payload }: PayloadAction<any>) => {
          state.loading = false;
          state.errors = payload;
        }
      )

      /**
       * *CREATE NEW TAG
       */
      .addCase(createSingleTag.pending, (state) => {
        state.loading = true;
      })
      .addCase(createSingleTag.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.singleTag = payload;
        state.errors = { ...initialState.errors };
      })
      .addCase(
        createSingleTag.rejected,
        (state, { payload }: PayloadAction<any>) => {
          state.loading = false;
          state.errors = payload;
        }
      )

      /**
       * *EDIT TAG
       */

      .addCase(editSingleTag.pending, (state) => {
        state.loading = true;
      })
      .addCase(editSingleTag.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.singleTag = payload;
        state.errors = { ...initialState.errors };
      })
      .addCase(
        editSingleTag.rejected,
        (state, { payload }: PayloadAction<any>) => {
          state.loading = false;
          state.errors = payload;
        }
      )

      /**
       * *DELETE TAG
       */

      .addCase(deleteSingleTag.pending, (state) => {
        state.loading = false;
      })
      .addCase(deleteSingleTag.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.singleTag = payload;
        state.errors = { ...initialState.errors };
      })
      .addCase(
        deleteSingleTag.rejected,
        (state, { payload }: PayloadAction<any>) => {
          state.loading = false;
          state.errors = payload;
        }
      );
  },
});

export default adminTagSlice.reducer;
export const { sort } = adminTagSlice.actions;
export const selectAdminTag = (state: RootState) => state.adminTag;
export const selectAdminSingleTag = (state: RootState) =>
  state.adminTag.singleTag;
