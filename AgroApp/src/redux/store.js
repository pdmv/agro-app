import { configureStore, createReducer } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import userReducer from "./userSlice";
import priceReducer from "./priceSlice";
import cartReducer from "./cartSlice";
import inventoryReducer from "./inventorySlice";
import productReducer from "./productSlice";
import supplierReducer from "./supplierSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    prices: priceReducer,
    cart: cartReducer,
    inventory: inventoryReducer,
    products: productReducer,
    suppliers: supplierReducer,
  },
});