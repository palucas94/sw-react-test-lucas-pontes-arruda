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
      currency: '',
      totalPrice: 0,
    };
  }

  componentDidMount() {
    this.fetchProducts();

    this.setState({
      cart: store.getState().cart.cart,
      cartQty: store.getState().cart.cartQty,
      currency: store.getState().currency.currentCurrency,
    });

    store.subscribe(() => {
      this.setState({
        cart: store.getState().cart.cart,
        cartQty: store.getState().cart.cartQty,
        currency: store.getState().currency.currentCurrency,
      }, () => this.getTotalPrice());
    });
  }

  getTotalPrice() {
    const { products, cart, currency } = this.state;
    let total = 0;

    cart.forEach(({ id, qty }) => {
      const product = products.find((p) => p.id === id);
      const { amount } = product.prices.find(({ currency: { symbol } }) => symbol === currency);
      total += (amount * qty);
    });

    this.setState({
      totalPrice: total,
    });
  }

  async fetchProducts() {
    const { data: { categories } } = await client.query({ query: GET_PRODUCTS });

    this.setState({
      products: categories[0].products,
    }, () => this.getTotalPrice());
  }

  render() {
    const {
      products, cart, cartQty, currency, totalPrice,
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

          <h4 className="cart-footer-text">
            Tax 21%:
            {' '}
            <span>{`${currency}${(totalPrice * 0.21).toFixed(2)}`}</span>
          </h4>

          <h4 className="cart-footer-text">
            Quantity:
            {' '}
            <span>{cartQty}</span>
          </h4>

          <h4 className="cart-footer-text">
            Total:
            {' '}
            <span>{`${currency}${(totalPrice * 1.21).toFixed(2)}`}</span>
          </h4>

          <button type="button" className="order-btn">Order</button>
        </div>
      </div>
    );
  }
}

export default Cart;
