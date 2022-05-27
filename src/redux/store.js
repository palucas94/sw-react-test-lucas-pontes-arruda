import { configureStore } from '@reduxjs/toolkit';
import categoryReducer from './reducers/categorySlice';
import currencyReducer from './reducers/currencySlice';
import cartReducer from './reducers/cartSlice';

const store = configureStore({
  reducer: {
    category: categoryReducer,
    currency: currencyReducer,
    cart: cartReducer,
  },
});

export default store;
