import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { login } from "../services/api";

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
    return rejectWithValue(error.message);
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isAuthenticated = action.payload.authenticated;
        state.token = action.payload.token; // Lưu token vào state
        state.status = 'succeeded';
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload; // Lưu thông báo lỗi vào state
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;