import React, { Component } from 'react';
import CartProductCard from '../../components/CartProductCard/CartProductCard';
import Header from '../../components/Header/Header';
import store from '../../redux/store';
import client from '../../services/apolloClient/client';
import GET_PRODUCTS from '../../services/graphqlQueries/getProductsQuery';
import './Cart.css';

class Cart extends Component {
  constructor() {
    super();

    this.state = {
      products: [],
      cart: [],
      cartQty: 0,
    };
  }

  componentDidMount() {
    this.fetchProducts();

    this.setState({
      cart: store.getState().cart.cart,
      cartQty: store.getState().cart.cartQty,
    });

    store.subscribe(() => {
      this.setState({
        cart: store.getState().cart.cart,
        cartQty: store.getState().cart.cartQty,
      });
    });
  }

  async fetchProducts() {
    const { data: { categories } } = await client.query({ query: GET_PRODUCTS });

    this.setState({
      products: categories[0].products,
    });
  }

  render() {
    const {
      products, cart, cartQty,
    } = this.state;

    return (
      <div>
        <Header />
        <div className="cart-page-container">
          <h1 className="cart-title">Cart</h1>
          <div className="cart-separating-line" />

          { cart.length && products.length && cart.map((p) => (
            <CartProductCard selectedAttrs={p} />
          ))}

          <h4>{`Quantity: ${cartQty}`}</h4>
          <button type="button">Order</button>
        </div>
      </div>
    );
  }
}

export default Cart;
