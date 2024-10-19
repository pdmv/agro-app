import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { login, getProfile, changeProfile, changeAvatar, changePassword, register } from "../services/api";

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  status: 'idle',
  error: null,
};

// Thunk để gọi API đăng nhập
export const loginThunk = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const data = await login(credentials);
    return data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

// Thunk để lấy thông tin user sau khi đăng nhập
export const getProfileThunk = createAsyncThunk("/users/profile", async (token, { rejectWithValue }) => {
  try {
    const data = await getProfile(token);
    return data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const changeProfileThunk = createAsyncThunk(
  "/users/change-profile",
  async ({ token, data }, { rejectWithValue }) => {
    try {
      const response = await changeProfile(token, data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const changeAvatarThunk = createAsyncThunk(
  'users/changeAvatar',
  async ({ token, data }, { rejectWithValue }) => {
    try {
      const response = await changeAvatar(token, data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const changePasswordThunk = createAsyncThunk(
  "/users/change-password",
  async ({ token, data }, { rejectWithValue }) => {
    try {
      const response = await changePassword(token, data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const registerThunk = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const response = await register(data);
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
    resetError: (state) => {
      state.error = null;
    },
    resetStatus: (state) => {
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      // Xử lý khi đăng nhập
      .addCase(loginThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isAuthenticated = action.payload.authenticated;
        state.token = action.payload.token;
        state.status = 'succeeded';
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = { message: action.payload.message, code: action.payload.code };
      })

      // Xử lý khi lấy profile
      .addCase(getProfileThunk.pending, (state) => {
        state.status = 'loading_profile';
      })
      .addCase(getProfileThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = 'profile_succeeded';
      })
      .addCase(getProfileThunk.rejected, (state, action) => {
        state.status = 'profile_failed';
        state.error = { message: action.payload.message, code: action.payload.code };
      })

      // Xử lý khi sửa profile
      .addCase(changeProfileThunk.pending, (state) => {
        state.status = 'changing_profile';
      })
      .addCase(changeProfileThunk.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload }; // Cập nhật thông tin người dùng
        state.status = 'profile_changed';
      })
      .addCase(changeProfileThunk.rejected, (state, action) => {
        state.status = 'profile_change_failed';
        state.error = { message: action.payload.message, code: action.payload.code };
      })
    
      // Xử lý khi đổi avatar
      .addCase(changeAvatarThunk.pending, (state) => {
        state.status = 'changing_avatar';
      })
      .addCase(changeAvatarThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = 'avatar_changed';
      })
      .addCase(changeAvatarThunk.rejected, (state, action) => {
        state.status = 'avatar_change_failed';
        state.error = { message: action.payload.message, code: action.payload.code };
      })
    
      // Xử lý khi đổi mật khẩu
      .addCase(changePasswordThunk.pending, (state) => {
        state.status = 'changing_password';
      })
      .addCase(changePasswordThunk.fulfilled, (state) => {
        state.status = 'password_changed';
      })
      .addCase(changePasswordThunk.rejected, (state, action) => {
        state.status = 'password_change_failed';
        state.error = { message: action.payload.message, code: action.payload.code };
      })
      
      // Xử lý khi đăng ký
      .addCase(registerThunk.pending, (state) => {
        state.status = 'registering';
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.status = 'register_succeeded';
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.status = 'register_failed';
        state.error = { message: action.payload.message, code: action.payload.code };
      })
  },
});

export const { logout, resetError, resetStatus } = authSlice.actions;
export default authSlice.reducer;