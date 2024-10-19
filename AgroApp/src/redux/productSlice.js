import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { listProduct } from "../services/api";

const initialState = {
  list: [],
  status: 'idle',
  error: null,
};

export const getProductListThunk = createAsyncThunk('products/getList', async () => {
  try {
    const response = await listProduct();
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});

const productSlice = createSlice({
  name: 'products',
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
      // Lấy ds mat hang
      .addCase(getProductListThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getProductListThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(getProductListThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
  }
});

export const { resetError, resetStatus } = productSlice.actions;
export default productSlice.reducer;