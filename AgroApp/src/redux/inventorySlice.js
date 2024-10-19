import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getInventory } from "../services/api";

const initialState = {
  inventory: [],
  status: 'idle',
  error: null,
};

export const getInventoryThunk = createAsyncThunk('inventory/get', async (token, { rejectWithValue }) => {
  try {
    const response = await getInventory(token);
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});

const inventorySlice = createSlice({
  name: 'inventory',
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
      // Lấy ds mat hang trong kho
      .addCase(getInventoryThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getInventoryThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.inventory = action.payload;
      })
      .addCase(getInventoryThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
  }
});

export const { resetError, resetStatus } = inventorySlice.actions;
export default inventorySlice.reducer;