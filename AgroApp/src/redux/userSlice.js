import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { adminChangeProfile, authApi, endpoints, getUsers, registerRoleUser } from "../services/api";

const initialState = {
  adminUsers: [],
  ownerUsers: [],
  staffUsers: [],
  ownerUsers: [],
  status: 'idle',
  error: null,
};

export const getAdminUserThunk = createAsyncThunk('users/getAdminUsers', async(token, { rejectWithValue }) => {
  try {
    const response = await getUsers(token, 'ADMIN');
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const getOwnerUserThunk = createAsyncThunk('users/getOwnerUsers', async(token, { rejectWithValue }) => {
  try {
    const response = await getUsers(token, 'OWNER');
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const getStaffUserThunk = createAsyncThunk('users/getStaffUsers', async(token, { rejectWithValue }) => {
  try {
    const response = await getUsers(token, 'STAFF');
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const getCustomerUserThunk = createAsyncThunk('users/getCustomerUsers', async(token, { rejectWithValue }) => {
  try {
    const response = await getUsers(token, 'CUSTOMER');
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const registerRoleUserThunk = createAsyncThunk('users/register', async ({ token, data }, { rejectWithValue }) => {
  try {
    const response = await registerRoleUser(token, data);
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const changeRoleUserThunk = createAsyncThunk('auth/register', async ({ token, userId, data }, { rejectWithValue }) => {
  try {
    const response = await adminChangeProfile(token, userId, data);
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    resetError: (state, action) => {
      state.error = action.payload;
    },
    resetStatus: (state) => {
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      // Xử lý lấy ADMIN
      .addCase(getAdminUserThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAdminUserThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.adminUsers = action.payload;
      })
      .addCase(getAdminUserThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Xử lý lấy OWNER
      .addCase(getOwnerUserThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getOwnerUserThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.ownerUsers = action.payload;
      })
      .addCase(getOwnerUserThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Xử lý lấy STAFF
      .addCase(getStaffUserThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getStaffUserThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.staffUsers = action.payload;
      })
      .addCase(getStaffUserThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Xử lý lấy CUSTOMER
      .addCase(getCustomerUserThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getCustomerUserThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.customerUsers = action.payload;
      })
      .addCase(getCustomerUserThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Xử lý thêm người dùng
      .addCase(registerRoleUserThunk.pending, (state) => {
        state.status = 'adding_user';
      })
      .addCase(registerRoleUserThunk.fulfilled, (state) => {
        state.status = 'user_added';
      })
      .addCase(registerRoleUserThunk.rejected, (state, action) => {
        state.status = 'adding_user_failed';
        state.error = action.payload;
      })
    
      // Xử lý thay đổi thông tin người dùng
      .addCase(changeRoleUserThunk.pending, (state) => {
        state.status = 'role_profile_changing';
      })
      .addCase(changeRoleUserThunk.fulfilled, (state) => {
        state.status = 'role_profile_changed';
      })
      .addCase(changeRoleUserThunk.rejected, (state, action) => {
        state.status = 'changing_role_profile_failed';
        state.error = action.payload;
      })
  },
});

export const { resetError, resetStatus } = userSlice.actions;
export default userSlice.reducer;