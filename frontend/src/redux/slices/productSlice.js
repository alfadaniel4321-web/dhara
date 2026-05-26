import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  nearbyProducts: [],
  selectedProduct: null,
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    fetchProductsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchProductsSuccess: (state, action) => {
      state.loading = false;
      state.products = action.payload;
    },
    fetchNearbySuccess: (state, action) => {
      state.nearbyProducts = action.payload;
    },
    fetchProductsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    }
  },
});

export const { fetchProductsStart, fetchProductsSuccess, fetchNearbySuccess, fetchProductsFailure, setSelectedProduct } = productSlice.actions;
export default productSlice.reducer;
