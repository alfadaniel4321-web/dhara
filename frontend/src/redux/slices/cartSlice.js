import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [],
  wishlistItems: [],
  totalPrice: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    setCartSuccess: (state, action) => {
      state.loading = false;
      state.cartItems = action.payload.products || [];
      state.totalPrice = action.payload.totalPrice || 0;
    },
    setCartFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setWishlist: (state, action) => {
      state.wishlistItems = action.payload || [];
    },
    clearCartLocal: (state) => {
      state.cartItems = [];
      state.totalPrice = 0;
    }
  },
});

export const { setCartStart, setCartSuccess, setCartFailure, setWishlist, clearCartLocal } = cartSlice.actions;
export default cartSlice.reducer;
