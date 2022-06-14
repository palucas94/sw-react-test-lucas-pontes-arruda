/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import CartOverlay from '../CartOverlay/CartOverlay';

import store from '../../redux/store';
import { changeCurrency } from '../../redux/reducers/currencySlice';
import { recoverSavedCart } from '../../redux/reducers/cartSlice';

import client from '../../services/apolloClient/client';
import GET_CATEGORIES from '../../services/graphqlQueries/getCategoriesQuery';
import GET_CURRENCIES from '../../services/graphqlQueries/getCurrenciesQuery';

import shoppingBag from '../../icons/shoppingbag.png';
import emptycart from '../../icons/emptycart.png';
import './Header.css';
import '../CartOverlay/CartOverlay.css';
import { changeCategory } from '../../redux/reducers/categorySlice';

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
    this.getLocalStorage();

    this.setState({
      category: store.getState().category.currentCategory,
      cartQty: store.getState().cart.cartQty,
    });

    store.subscribe(() => {
      this.setState({
        category: store.getState().category.currentCategory,
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

    if (!isClickInside || currencyDropdown.contains(target)) {
      const backgroundCover = document.getElementById('background-cover');
      backgroundCover.classList.remove('dark');
      document.body.classList.remove('overflow-hidden');
    }
  }

  getLocalStorage() {
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
    const backgroundCover = document.getElementById('background-cover');

    cartOverlay.classList.toggle('show-cart-overlay');
    dropdown.classList.remove('show-currencies');
    dropdownArrow.classList.remove('up');
    backgroundCover.classList.toggle('dark');
    document.body.classList.toggle('overflow-hidden');
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

  render() {
    const {
      categories, currencies, currency, category, cartQty, dataError,
    } = this.state;

    if (dataError) return <p>Something went wrong.. Please reload the page</p>;

    return (
      <header className="header-container">

        <nav>
          { categories.map(({ name }) => (
            <Link
              to={`/${name}`}
              onClick={() => store.dispatch(changeCategory(name))}
              value={name}
              key={name}
              className={category === name ? 'category selected-category' : 'category'}
            >
              {name}
            </Link>
          ))}
        </nav>

        <img src={shoppingBag} alt="Shopping bag" className="icon-shoppingbag" />

        <div className="cart-currency-container">
          <div id="currency-dropdown" className="currency-dropdown">
            <button
              data-testid="current-currency"
              type="button"
              onClick={this.showCurrencies}
              className="currency-dropdown-btn"
            >
              {currency}
              <div data-testid="dropdown-arrow" id="dropdown-arrow" className="currency-dropdown-arrow" />
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
              <img data-testid="cart-icon" src={emptycart} alt="cart" className="icon-emptycart" />
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
