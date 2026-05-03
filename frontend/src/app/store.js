import { configureStore } from '@reduxjs/toolkit';
import tripsReducer from '../features/trips/store/tripsSlice';
import userReducer from '../features/auth/store/userSlice';
import themeReducer from '../features/theme/themeSlice';

export const store = configureStore({
  reducer: {
    trips: tripsReducer,
    user: userReducer,
    theme: themeReducer,
  },
});