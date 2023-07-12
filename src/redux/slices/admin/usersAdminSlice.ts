import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { TUser } from '../userSlice';
import { RootState } from '../../store';
import { UserSort } from '../../../components/Admin/users/AdminUsers';
import { UserRole } from '../../../components/Admin/users/EditUserRole';

const VITE_API_URL = import.meta.env.VITE_API_URL;

/**
 * * Types
 */

type AdminUserState = {
  allUsers: TUser[];
  loading: boolean;
  errors: {
    message: string | null;
    status: string | null;
  };
};

/**
 * * Thunks
 */

export const fetchAllUsersAdmin = createAsyncThunk(
  'adminUsers/fetchAllUsersAdmin',
  async (_, thunkApi) => {
    try {
      const { data } = await axios.get(VITE_API_URL + '/api/user', {
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
    }
  }
);

export const updateUserRole = createAsyncThunk(
  'adminUsers/updateUserRole',
  async ({ role, userId }: { role: UserRole; userId: string }, thunkApi) => {
    try {
      const { data } = await axios.put(
        VITE_API_URL + '/api/admin-user/' + userId,
        { role },
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

export const deleteUser = createAsyncThunk(
  'adminUsers/deleteUser',
  async ({ userId }: { userId: string }, thunkApi) => {
    try {
      await axios.delete(VITE_API_URL + '/api/user/' + userId, {
        withCredentials: true,
      });
      return { userId };
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

/**
 * * Slice
 */

const initialState: AdminUserState = {
  allUsers: [],
  loading: false,
  errors: {
    message: null,
    status: null,
  },
};

const adminUsersSlice = createSlice({
  name: 'adminUsers',
  initialState,
  reducers: {
    sortUsersAdmin: (
      state,
      { payload: { sortDir, sortField } }: { payload: UserSort }
    ) => {
      let sortedUsers: TUser[] = [];
      if (sortDir === 'asc') {
        if (['firstName', 'email', 'role'].includes(sortField)) {
          sortedUsers = [...state.allUsers].sort((a: any, b: any) => {
            if (a[sortField].toLowerCase() === b[sortField].toLowerCase()) {
              return a._id > b._id ? 1 : -1;
            }

            return a[sortField].toLowerCase() > b[sortField].toLowerCase()
              ? 1
              : -1;
          });
        } else if (sortField === 'lastName') {
          sortedUsers = [...state.allUsers].sort((a, b) => {
            if (a.lastName.toLowerCase() === b.lastName.toLowerCase()) {
              return a._id > b._id ? 1 : -1;
            }

            return a.lastName.toLowerCase() > b.lastName.toLowerCase() ? 1 : -1;
          });
        } else if (sortField === 'cartSize') {
          sortedUsers = [...state.allUsers].sort((a, b) => {
            if (a.cart.products.length === b.cart.products.length) {
              return a._id < b._id ? 1 : -1;
            }

            return b.cart.products.length - a.cart.products.length;
          });
        } else {
          sortedUsers = [...state.allUsers].sort((a: any, b: any) => {
            if (a[sortField] === b[sortField]) {
              return a._id < b._id ? 1 : -1;
            } else {
              return b[sortField] - a[sortField];
            }
          });
        }
      } else {
        if (['firstName', 'email', 'state', 'role'].includes(sortField)) {
          sortedUsers = [...state.allUsers].sort((a: any, b: any) => {
            if (a[sortField].toLowerCase() === b[sortField].toLowerCase()) {
              return a._id < b._id ? 1 : -1;
            }

            return a[sortField].toLowerCase() < b[sortField].toLowerCase()
              ? 1
              : -1;
          });
        } else if (sortField === 'lastName') {
          sortedUsers = [...state.allUsers].sort((a, b) => {
            if (a.lastName.toLowerCase() === b.lastName.toLowerCase()) {
              return a._id < b._id ? 1 : -1;
            }

            return a.lastName.toLowerCase() < b.lastName.toLowerCase() ? 1 : -1;
          });
        } else {
          sortedUsers = [...state.allUsers].sort((a: any, b: any) => {
            if (a[sortField] === b[sortField]) {
              return a._id < b._id ? 1 : -1;
            } else {
              return b[sortField] - a[sortField];
            }
          });
        }
      }

      return { ...state, allUsers: sortedUsers };
    },
  },
  extraReducers: (builder) => {
    /**
     * * FETCH ALL USERS
     */
    builder
      .addCase(fetchAllUsersAdmin.pending, (state) => {
        return { ...state, loading: true };
      })
      .addCase(fetchAllUsersAdmin.fulfilled, (state, { payload }) => {
        return { ...state, loading: false, allUsers: payload };
      })
      .addCase(
        fetchAllUsersAdmin.rejected,
        (_, { payload }: PayloadAction<any>) => {
          return { ...initialState, errors: payload };
        }
      );

    /**
     * * UPDATE USER ROLE
     */
    builder
      .addCase(updateUserRole.pending, (state) => {
        return { ...state, loading: true };
      })
      .addCase(updateUserRole.fulfilled, (state, { payload }) => {
        return { ...state, loading: false, allUsers: payload };
      })
      .addCase(
        updateUserRole.rejected,
        (_, { payload }: PayloadAction<any>) => {
          return { ...initialState, errors: payload };
        }
      );

    /**
     * * DELETE USER
     */

    builder
      .addCase(deleteUser.pending, (state) => {
        return { ...state, loading: true };
      })
      .addCase(deleteUser.fulfilled, (state, { payload }) => {
        return {
          ...state,
          loading: false,
          errors: { message: null, status: null },
          allUsers: [...state.allUsers].filter(
            (user) => user._id !== payload!.userId
          ),
        };
      })
      .addCase(deleteUser.rejected, (state) => {
        return { ...state, loading: true };
      });
  },
});

/**
 * * Exports
 */

export const selectAdminUsersState = (state: RootState) => state.adminUsers;
export const selectAdminUsers = (state: RootState) => state.adminUsers.allUsers;

export const { sortUsersAdmin } = adminUsersSlice.actions;

export default adminUsersSlice.reducer;
