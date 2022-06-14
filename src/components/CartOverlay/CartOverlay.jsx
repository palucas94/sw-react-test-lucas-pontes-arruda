/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import CartProductCard from '../CartProductCard/CartProductCard';
import store from '../../redux/store';
import './CartOverlay.css';

class CartOverlay extends Component {
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
      }, () => setInterval(() => this.getTotalPrice(), 300));
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
        <h1 className="cart-overlay-title">{`My bag, ${cartQty} items`}</h1>

        { cart.length === 0 ? <div /> : (
          <div className="cart-overlay-wrapper">
            {cart.map((p, i) => (
              <CartProductCard key={p.id + i} origin="overlay" selectedAttrs={p} />
            ))}
          </div>
        )}

        <div className="cart-overlay-footer">
          <h4 className="overlay-footer-text">
            Total:
            {' '}
            <span>{`${currency}${(totalPrice * 1.21).toFixed(2)}`}</span>
          </h4>

          <div>
            <Link to="/cart">
              <button type="button" className="view-bag-btn">View Bag</button>
            </Link>
            <button type="button" className="checkout-btn">Check out</button>
          </div>
        </div>
      </div>
    );
  }
}

export default CartOverlay;
