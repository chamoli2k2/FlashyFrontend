// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import toastReducer from './reducers/toastReducer.js';

const store = configureStore({
  reducer: {
    toast: toastReducer,
    // other reducers
  },
});

export default store;
