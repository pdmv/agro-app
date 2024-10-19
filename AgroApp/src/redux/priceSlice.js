import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { listPrice } from "../services/api";

const initialState = {
  list: [],
  status: 'idle',
  error: null,
};

export const getListThunk = createAsyncThunk('prices/getList', async () => {
  try {
    const response = await listPrice();
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});

const priceSlice = createSlice({
  name: 'prices',
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
      // Lấy ds bảng giá
      .addCase(getListThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getListThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(getListThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
  }
});

export const { resetError, resetStatus } = priceSlice.actions;
export default priceSlice.reducer;