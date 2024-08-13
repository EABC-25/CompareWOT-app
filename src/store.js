import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './api/apiSlice';
import tanksReducer from './redux/tanksSlice';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    tanks: tanksReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
