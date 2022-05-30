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
        <h1 className="cart-overlay-title">{`My bag, ${cartQty} items`}</h1>

        <div className="cart-overlay-wrapper">
          { cart.length && products.length && cart.map((p) => (
            <CartProductCard origin="overlay" selectedAttrs={p} />
          ))}
        </div>

        <div className="cart-overlay-footer">
          <h6>Total</h6>

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
