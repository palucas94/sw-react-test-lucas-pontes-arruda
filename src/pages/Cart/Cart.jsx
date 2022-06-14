/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react';
import store from '../../redux/store';
import Header from '../../components/Header/Header';
import CartProductCard from '../../components/CartProductCard/CartProductCard';
import './Cart.css';

class Cart extends Component {
  constructor() {
    super();

    this.state = {
      cart: [],
      cartQty: 0,
      currency: '',
      totalPrice: 0,
    };
  }

  componentDidMount() {
    document.body.classList.remove('overflow-hidden');

    this.setState({
      cart: store.getState().cart.cart,
      cartQty: store.getState().cart.cartQty,
      currency: store.getState().currency.currentCurrency,
    }, () => this.getTotalPrice());

    store.subscribe(() => {
      this.setState({
        cart: store.getState().cart.cart,
        cartQty: store.getState().cart.cartQty,
        currency: store.getState().currency.currentCurrency,
      }, () => this.getTotalPrice());
    });
  }

  getTotalPrice() {
    const { cart, currency } = this.state;
    let total = 0;

    cart.forEach(({ qty, prices }) => {
      const { amount } = prices.find(({ currency: { symbol } }) => symbol === currency);
      total += (amount * qty);
    });

    this.setState({
      totalPrice: total,
    });
  }

  render() {
    const {
      cart, cartQty, currency, totalPrice,
    } = this.state;

    return (
      <div>
        <Header />

        <div id="background-cover" />

        <main className="cart-page-container">
          <h1 className="cart-title">Cart</h1>
          <div className="cart-separating-line" />

          { cart.length && cart.map((p, i) => (
            <CartProductCard key={p.id + i} selectedAttrs={p} />
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
            <span>{`${currency}${totalPrice.toFixed(2)}`}</span>
          </h4>

          <button type="button" className="order-btn">Order</button>
        </main>
      </div>
    );
  }
}

export default Cart;
