import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { listProduct, listSupplier } from "../services/api";

const initialState = {
  list: [],
  status: 'idle',
  error: null,
};

export const getSupplierListThunk = createAsyncThunk('suppliers/getList', async (token, { rejectWithValue }) => {
  try {
    const response = await listSupplier(token);
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});

const supplierSlice = createSlice({
  name: 'suppliers',
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
      // Lấy ds ncc
      .addCase(getSupplierListThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getSupplierListThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(getSupplierListThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
  }
});

export const { resetError, resetStatus } = supplierSlice.actions;
export default supplierSlice.reducer;