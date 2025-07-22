// src/store/cartSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { CartItem, CustomerData, ShippingQuote } from "../types/cart";

interface CartState {
  items: CartItem[];
  customerData: CustomerData | null;
  shippingQuote: ShippingQuote | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  customerData: null,
  shippingQuote: null,
  isLoading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    clearCart: (state) => {
      state.items = [];
      state.customerData = null;
      state.shippingQuote = null;
      state.isLoading = false;
      state.error = null;
    },
    setCustomerData: (state, action: PayloadAction<CustomerData>) => {
      state.customerData = action.payload;
    },
    setShippingQuote: (state, action: PayloadAction<ShippingQuote>) => {
      state.shippingQuote = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const {
  setCart,
  clearCart,
  setCustomerData,
  setShippingQuote,
  setLoading,
  setError,
} = cartSlice.actions;

export default cartSlice.reducer;
