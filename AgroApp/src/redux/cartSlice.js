import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const price = action.payload;
      const existingItem = state.items.find(item => item.id === price.id);

      if (existingItem) {
        existingItem.quantity += 1;
        existingItem.totalPrice += price.price;
      } else {
        state.items.push({ ...price, quantity: 1, totalPrice: price.price });
      }

      state.totalQuantity += 1;
      state.totalPrice += price.price;
    },

    removeFromCart: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find(item => item.id === id);

      if (existingItem) {
        state.totalQuantity -= existingItem.quantity;
        state.totalPrice -= existingItem.totalPrice;
        state.items = state.items.filter(item => item.id !== id);
      }
    },

    incrementQuantity: (state, action) => {
      const id = action.payload;
      const item = state.items.find(product => product.id === id);
      if (item) {
        item.quantity = parseFloat((item.quantity + 0.1).toFixed(1)); // Handle floating point precision
        item.totalPrice = parseFloat((item.totalPrice + item.price * 0.1).toFixed(1));
        state.totalPrice = parseFloat((state.totalPrice + item.price * 0.1).toFixed(1));
      }
    },

    decrementQuantity: (state, action) => {
      const id = action.payload;
      const item = state.items.find(product => product.id === id);
      if (item && item.quantity > 0.1) {
        item.quantity = parseFloat((item.quantity - 0.1).toFixed(1)); // Ensure it doesn't go below 0
        item.totalPrice = parseFloat((item.totalPrice - item.price * 0.1).toFixed(1));
        state.totalPrice = parseFloat((state.totalPrice - item.price * 0.1).toFixed(1));
      }
    },

    resetCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    },

    setQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(product => product.id === id);

      if (item && quantity >= 0) {
        const oldQuantity = item.quantity;
        const oldTotalPrice = item.totalPrice;

        item.quantity = parseFloat(quantity.toFixed(1));
        item.totalPrice = parseFloat((item.price * quantity).toFixed(1));

        state.totalQuantity += item.quantity - oldQuantity;
        state.totalPrice += item.totalPrice - oldTotalPrice;
      }
    }
  },
});

export const { addToCart, removeFromCart, incrementQuantity, decrementQuantity, resetCart, setQuantity } = cartSlice.actions;
export default cartSlice.reducer;