/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import CartOverlay from '../CartOverlay/CartOverlay';

import store from '../../redux/store';
import { changeCategory } from '../../redux/reducers/categorySlice';
import { changeCurrency } from '../../redux/reducers/currencySlice';
import { recoverSavedCart, setAllProducts } from '../../redux/reducers/cartSlice';

import client from '../../services/apolloClient/client';
import GET_CATEGORIES from '../../services/graphqlQueries/getCategoriesQuery';
import GET_CURRENCIES from '../../services/graphqlQueries/getCurrenciesQuery';
import GET_PRODUCTS from '../../services/graphqlQueries/getProductsQuery';

import shoppingBag from '../../icons/shoppingbag.png';
import emptycart from '../../icons/emptycart.png';
import './Header.css';
import '../CartOverlay/CartOverlay.css';

class Header extends Component {
  constructor() {
    super();

    this.state = {
      categories: [],
      currencies: [],
      currency: '',
      category: '',
      cartQty: 0,
      dataError: false,
    };
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);

    this.fetchCategories();
    this.fetchCurrencies();
    this.fetchProducts();
    this.getLocalStorage();

    this.setState({
      cartQty: store.getState().cart.cartQty,
    });

    store.subscribe(() => {
      this.setState({
        cartQty: store.getState().cart.cartQty,
      });
    });
  }

  handleClickOutside({ target }) {
    const currencyDropdown = document.getElementById('currency-dropdown');
    const cartOverlayContainer = document.getElementById('cart-overlay-container');

    const isClickInside = currencyDropdown.contains(target)
      || cartOverlayContainer.contains(target);

    if (!isClickInside) {
      const dropdown = document.getElementById('dropdown');
      const cartOverlay = document.getElementById('cart-overlay');
      const dropdownArrow = document.getElementById('dropdown-arrow');

      cartOverlay.classList.remove('show-cart-overlay');
      dropdown.classList.remove('show-currencies');
      dropdownArrow.classList.remove('up');
    }
  }

  getLocalStorage() {
    const currentCategory = JSON.parse(localStorage.getItem('swCategory'));
    if (currentCategory) {
      store.dispatch(changeCategory(currentCategory));
      this.setState({
        category: currentCategory,
      });
    } else {
      localStorage.setItem('swCategory', JSON.stringify('all'));
      this.setState({
        category: 'all',
      });
    }

    const currentCurrency = JSON.parse(localStorage.getItem('swCurrency'));
    if (currentCurrency) {
      store.dispatch(changeCurrency(currentCurrency));
      this.setState({
        currency: currentCurrency,
      });
    } else {
      localStorage.setItem('swCurrency', JSON.stringify('$'));
      this.setState({
        currency: '$',
      });
    }

    const savedCart = JSON.parse(localStorage.getItem('swCart'));
    if (savedCart) {
      store.dispatch(recoverSavedCart(savedCart));
    }
  }

  changeCurrentCurrency(currency) {
    localStorage.setItem('swCurrency', JSON.stringify(currency));
    store.dispatch(changeCurrency(currency));
    this.setState({
      currency,
    });
  }

  changeCurrentCategory(category) {
    localStorage.setItem('swCategory', JSON.stringify(category));
    store.dispatch(changeCategory(category));
    this.setState({
      category,
    });
  }

  currencySelected({ target: { value } }) {
    this.changeCurrentCurrency(value);
    this.showCurrencies();
  }

  showCurrencies() {
    const dropdown = document.getElementById('dropdown');
    const dropdownArrow = document.getElementById('dropdown-arrow');
    const cartOverlay = document.getElementById('cart-overlay');

    dropdown.classList.toggle('show-currencies');
    dropdownArrow.classList.toggle('up');
    cartOverlay.classList.remove('show-cart-overlay');
  }

  showCartOverlay() {
    const cartOverlay = document.getElementById('cart-overlay');
    const dropdown = document.getElementById('dropdown');
    const dropdownArrow = document.getElementById('dropdown-arrow');

    cartOverlay.classList.toggle('show-cart-overlay');
    dropdown.classList.remove('show-currencies');
    dropdownArrow.classList.remove('up');
  }

  async fetchCategories() {
    try {
      const { data: { categories } } = await client.query({ query: GET_CATEGORIES });
      this.setState({ categories });
    } catch (e) {
      this.setState({
        dataError: true,
      });
    }
  }

  async fetchCurrencies() {
    try {
      const { data: { currencies } } = await client.query({ query: GET_CURRENCIES });
      this.setState({ currencies });
    } catch (e) {
      this.setState({
        dataError: true,
      });
    }
  }

  async fetchProducts() {
    const { data: { categories } } = await client.query({ query: GET_PRODUCTS });
    store.dispatch(setAllProducts(categories));
  }

  render() {
    const {
      categories, currencies, currency, category, cartQty, dataError,
    } = this.state;

    if (dataError) return <p>Something went wrong.. Please reload the page</p>;

    return (
      <header className="header-container">

        <nav>
          { categories.map(({ name }) => (
            <button
              value={name}
              type="button"
              onClick={({ target: { value } }) => this.changeCurrentCategory(value)}
              key={name}
              className={category === name ? 'category selected-category' : 'category'}
            >
              {name}
            </button>
          ))}
        </nav>

        <img src={shoppingBag} alt="Shopping bag" className="icon-shoppingbag" />

        <div className="cart-currency-container">
          <div id="currency-dropdown" className="currency-dropdown">
            <button
              type="button"
              onClick={this.showCurrencies}
              className="currency-dropdown-btn"
            >
              {currency}
              <div id="dropdown-arrow" className="currency-dropdown-arrow" />
            </button>

            <div id="dropdown" className="currency-dropdown-content">
              { currencies.map(({ label, symbol }) => (
                <button
                  type="button"
                  onClick={(e) => this.currencySelected(e)}
                  key={symbol}
                  value={symbol}
                >
                  {`${symbol} ${label}`}
                </button>
              ))}
            </div>
          </div>

          <div id="cart-overlay-container" className="cart-overlay-container">
            <button className="cart-btn" type="button" onClick={this.showCartOverlay}>
              { cartQty > 0 && <div className="cart-item-qty">{cartQty}</div>}
              <img src={emptycart} alt="cart" className="icon-emptycart" />
            </button>
            <div id="cart-overlay" className="cart-overlay-content">
              <CartOverlay />
            </div>
          </div>
        </div>

      </header>
    );
  }
}

export default Header;
