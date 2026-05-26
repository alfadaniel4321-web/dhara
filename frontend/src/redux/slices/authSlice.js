import { createSlice } from '@reduxjs/toolkit';

const savedUser = localStorage.getItem('dhara_user');
const savedToken = localStorage.getItem('dhara_token');

const initialState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  token: savedToken || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    setAuthSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('dhara_user', JSON.stringify(action.payload.user));
      localStorage.setItem('dhara_token', action.payload.token);
    },
    setAuthFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      state.loading = false;
      localStorage.removeItem('dhara_user');
      localStorage.removeItem('dhara_token');
    },
    updateUserRating: (state, action) => {
      if (state.user) {
        state.user.rating = action.payload.rating;
        state.user.negativeFeedbacksCount = action.payload.negativeFeedbacksCount;
        state.user.blocked = action.payload.blocked;
        localStorage.setItem('dhara_user', JSON.stringify(state.user));
      }
    }
  },
});

export const { setAuthStart, setAuthSuccess, setAuthFailure, logoutUser, updateUserRating } = authSlice.actions;
export default authSlice.reducer;
