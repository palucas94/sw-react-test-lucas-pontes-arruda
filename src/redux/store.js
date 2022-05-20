import { configureStore } from '@reduxjs/toolkit';
import categoryReducer from './reducers/categorySlice';
import currencyReducer from './reducers/currencySlice';

const store = configureStore({
  reducer: {
    category: categoryReducer,
    currency: currencyReducer,
  },
});

export default store;
