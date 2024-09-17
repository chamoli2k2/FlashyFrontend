// src/redux/actions/toastActions.js

export const SHOW_TOAST = 'SHOW_TOAST';
export const HIDE_TOAST = 'HIDE_TOAST';

// Action to show a toast
export const showToast = (message, type = 'info') => {
  return {
    type: SHOW_TOAST,
    payload: { message, type },
  };
};

// Action to hide a toast
export const hideToast = () => {
  return {
    type: HIDE_TOAST,
  };
};
