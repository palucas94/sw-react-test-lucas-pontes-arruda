/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

export const categorySlice = createSlice({
  name: 'category',
  initialState: {
    currentCategory: 'all',
  },
  reducers: {
    changeCategory: (state, action) => {
      localStorage.setItem('swCategory', JSON.stringify(action.payload));
      state.currentCategory = action.payload;
    },
  },
});

export const { changeCategory } = categorySlice.actions;
export default categorySlice.reducer;
