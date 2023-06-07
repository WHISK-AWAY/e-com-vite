import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import axios, { AxiosError } from 'axios';

const VITE_API_URL = import.meta.env.VITE_API_URL;

export const fetchAllTags = createAsyncThunk(
  'tags/fetchAllTags',
  async (_, thunkApi) => {
    try {
      const { data } = await axios.get(VITE_API_URL + '/api/tag', {
        withCredentials: true,
      });

      return data;
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log('error in fetchAllTags:', err);
        return thunkApi.rejectWithValue({
          status: err.response?.status,
          message: err.response?.data.message,
        });
      }
      console.log('bad error in fetchAllTags:', err);
    }
  }
);

const initialState: TagState = {
  tags: [] as TTag[],
  loading: false,
  errors: {
    status: null,
    message: null,
  },
};

const tagSlice = createSlice({
  name: 'tag',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTags.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllTags.fulfilled, (state, { payload }) => {
        return { ...initialState, tags: payload };
      })
      .addCase(fetchAllTags.rejected, (_, { payload }: PayloadAction<any>) => {
        return { ...initialState, errors: payload };
      });
  },
});


export type TTag = {
  tagName: string;
  _id: string;
};

export type TagState = {
  tags: TTag[];
  loading: boolean;
  errors: {
    status: number | null;
    message: string | null;
  };
};

    export const selectTagState = (state: RootState) => state.tag;
    export default tagSlice.reducer;