import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
  activeOrder: null,
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    orderStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    orderSuccess: (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    },
    setActiveOrder: (state, action) => {
      state.activeOrder = action.payload;
    },
    orderFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  },
});

export const { orderStart, orderSuccess, setActiveOrder, orderFailure } = orderSlice.actions;
export default orderSlice.reducer;
