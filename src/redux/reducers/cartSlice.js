/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    currentProduct: {
      id: '',
      attributes: [],
      qty: 1,
    },
    cart: [],
    cartQty: 0,
  },
  reducers: {
    setInitialProductAttributes: (state, action) => {
      const { id: currentId, attributes } = state.currentProduct;
      const { id, product } = action.payload;
      const { attributes: productAttr } = product;

      if (currentId !== id) {
        attributes.length = 0;
        state.currentProduct.id = id;
      }

      if (productAttr.length) {
        productAttr.forEach(({ name, type, items }) => (
          attributes.push({ name, type, value: items[0].value })));
      }
    },

    setCurrentProductAttributes: (state, action) => {
      const { attributes } = state.currentProduct;
      const { name, type, value } = action.payload;

      const index = attributes.findIndex((i) => i.name === name);
      attributes[index] = { name, type, value };
    },

    addToCart: (state) => {
      const { cart, currentProduct } = state;
      const { id, attributes } = currentProduct;

      const inCart = cart.find((p) => (
        p.id === id && JSON.stringify(p.attributes) === JSON.stringify(attributes)
      ));

      if (inCart) {
        const index = cart.findIndex((p) => p === inCart);
        cart[index].qty += 1;
      } else {
        cart.push(currentProduct);
      }

      state.cartQty += 1;

      localStorage.setItem('swCart', JSON.stringify(cart));
    },

    recoverSavedCart: (state, action) => {
      state.cart = action.payload;

      let qtyCount = 0;
      state.cart.forEach((p) => { qtyCount += p.qty; });
      state.cartQty = qtyCount;
    },
  },
});

export const {
  fetchAllproducts, addToCart, recoverSavedCart,
  setInitialProductAttributes, setCurrentProductAttributes,
} = cartSlice.actions;
export default cartSlice.reducer;
