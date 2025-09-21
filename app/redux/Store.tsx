import { configureStore } from '@reduxjs/toolkit';
import appReducer from './slice/AppSlice';

const Store = configureStore({
  reducer: {
    app: appReducer,
  },
});



export default Store;