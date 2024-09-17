// src/components/ToastNotification.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import { hideToast } from '../Redux/reducers/toastReducer.js';
import 'react-toastify/dist/ReactToastify.css';

const ToastNotification = () => {
  const dispatch = useDispatch();
  const { message, type, visible } = useSelector(state => state.toast);

  React.useEffect(() => {
    if (visible) {
      switch (type) {
        case 'success':
          toast.success(message);
          break;
        case 'error':
          toast.error(message);
          break;
        case 'info':
        default:
          toast.info(message);
          break;
      }
      // Hide the toast after showing it
      dispatch(hideToast());
    }
  }, [visible, type, message, dispatch]);

  return <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} />;
};

export default ToastNotification;
