// src/redux/reducers/toastReducer.js
import { createSlice } from '@reduxjs/toolkit';

const toastSlice = createSlice({
  name: 'toast',
  initialState: {
    message: '',
    type: 'info', // 'info', 'success', 'error'
    visible: false,
  },
  reducers: {
    showToast: (state, action) => {
      console.log("This is the debug statement: ", action.payload);
      const { message = '', type = 'info' } = action.payload || {};
      state.message = message;
      state.type = type;
      state.visible = true;
    },
    hideToast: (state) => {
      state.visible = false;
    },
  },
});

export const { showToast, hideToast } = toastSlice.actions;
export default toastSlice.reducer;
