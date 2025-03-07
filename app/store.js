// store.js
import { configureStore } from '@reduxjs/toolkit';
import booksReducer from './booksSlice';
import cartReducer from './cartSlice';

export const store = configureStore({
  reducer: {
    books: booksReducer,
    cart: cartReducer,
  },
});

