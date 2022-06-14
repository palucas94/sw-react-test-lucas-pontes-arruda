/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

export const categorySlice = createSlice({
  name: 'category',
  initialState: {
    currentCategory: 'all',
  },
  reducers: {
    changeCategory: (state, action) => {
      state.currentCategory = action.payload;
    },
  },
});

export const { changeCategory } = categorySlice.actions;
export default categorySlice.reducer;
