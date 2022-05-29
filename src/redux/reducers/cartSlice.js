/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    allProducts: [],
    currentProduct: {
      id: '',
      attributes: [],
      qty: 1,
    },
    cart: [],
    cartQty: 0,
  },
  reducers: {
    setAllProducts: (state, action) => {
      const { products } = action.payload[0];
      state.allProducts = products;
    },

    setInitialProductAttributes: (state, action) => {
      const { attributes } = state.currentProduct;
      const { id, product } = action.payload;
      const { attributes: productAttr } = product;

      attributes.length = 0;
      state.currentProduct.id = id;

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

    addToCartFromPLP: (state, action) => {
      const id = action.payload;
      const { allProducts, currentProduct } = state;
      const { attributes: productAttr } = allProducts.find((p) => p.id === id);

      currentProduct.attributes.length = 0;
      state.currentProduct.id = id;

      if (productAttr.length) {
        productAttr.forEach(({ name, type, items }) => (
          currentProduct.attributes.push({ name, type, value: items[0].value })));
      }

      cartSlice.caseReducers.addToCart(state);
    },

    recoverSavedCart: (state, action) => {
      state.cart = action.payload;

      let qtyCount = 0;
      state.cart.forEach((p) => { qtyCount += p.qty; });
      state.cartQty = qtyCount;
    },

    incProductQty: (state, action) => {
      const { cart } = state;
      const { id, attributes } = action.payload;

      const index = cart.findIndex((p) => (
        p.id === id && JSON.stringify(p.attributes) === JSON.stringify(attributes)
      ));

      cart[index].qty += 1;
      state.cartQty += 1;
      localStorage.setItem('swCart', JSON.stringify(cart));
    },

    decProductQty: (state, action) => {
      const { cart } = state;
      const { id, attributes } = action.payload;

      const index = cart.findIndex((p) => (
        p.id === id && JSON.stringify(p.attributes) === JSON.stringify(attributes)
      ));

      cart[index].qty -= 1;

      if (cart[index].qty === 0) {
        cart.splice(index, 1);
      }

      state.cartQty -= 1;
      localStorage.setItem('swCart', JSON.stringify(cart));
    },
  },
});

export const {
  setAllProducts, addToCart, addToCartFromPLP, recoverSavedCart,
  setInitialProductAttributes, setCurrentProductAttributes,
  incProductQty, decProductQty,
} = cartSlice.actions;
export default cartSlice.reducer;
