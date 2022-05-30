import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import CartProductCard from '../CartProductCard/CartProductCard';
import store from '../../redux/store';
import client from '../../services/apolloClient/client';
import GET_PRODUCTS from '../../services/graphqlQueries/getProductsQuery';
import './CartOverlay.css';

class CartOverlay extends Component {
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
      }, () => setInterval(() => this.getTotalPrice(), 100));
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
        <h1 className="cart-overlay-title">{`My bag, ${cartQty} items`}</h1>

        <div className="cart-overlay-wrapper">
          { cart.length && products.length && cart.map((p) => (
            <CartProductCard origin="overlay" selectedAttrs={p} />
          ))}
        </div>

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
