import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: null,
  isAuthenticated: false,
  isLoading: false,
  hasCheckedAuth: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authStarted: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    authSucceeded: (state, action) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.hasCheckedAuth = true;
      state.error = null;
    },
    authFailed: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    authCheckStarted: (state) => {
      state.hasCheckedAuth = false;
    },
    authCheckSucceeded: (state, action) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
      state.hasCheckedAuth = true;
      state.error = null;
    },
    authCheckFailed: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.hasCheckedAuth = true;
    },
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.hasCheckedAuth = true;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  authStarted,
  authSucceeded,
  authFailed,
  authCheckStarted,
  authCheckSucceeded,
  authCheckFailed,
  logout,
  clearError,
} = userSlice.actions;

export default userSlice.reducer;
