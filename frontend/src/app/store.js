import { configureStore } from '@reduxjs/toolkit';
import tripsReducer from '../features/trips/store/tripsSlice';
import userReducer from '../features/auth/store/userSlice';

export const store = configureStore({
  reducer: {
    trips: tripsReducer,
    user: userReducer,
  },
});