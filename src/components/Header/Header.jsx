import React, { Component } from 'react';
import { changeCategory } from '../../redux/reducers/categorySlice';
import { changeCurrency } from '../../redux/reducers/currencySlice';
import store from '../../redux/store';
import client from '../../services/apolloClient/client';
import GET_CATEGORIES from '../../services/graphqlQueries/getCategoriesQuery';
import GET_CURRENCIES from '../../services/graphqlQueries/getCurrenciesQuery';
import shoppingBag from '../../icons/shoppingbag.png';
import emptycart from '../../icons/emptycart.png';
import './Header.css';

class Header extends Component {
  constructor() {
    super();

    this.state = {
      categories: [],
      currencies: [],
      currency: '',
      category: '',
      dataError: false,
    };
  }

  componentDidMount() {
    this.fetchCategories();
    this.fetchCurrencies();
    this.getLocalStorage();
  }

  fetchCategories = async () => {
    try {
      const { data: { categories } } = await client.query({ query: GET_CATEGORIES });
      this.setState({ categories });
    } catch (e) {
      this.setState({
        dataError: true,
      });
    }
  };

  fetchCurrencies = async () => {
    try {
      const { data: { currencies } } = await client.query({ query: GET_CURRENCIES });
      this.setState({ currencies });
    } catch (e) {
      this.setState({
        dataError: true,
      });
    }
  };

  getLocalStorage = () => {
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
  };

  changeCurrentCurrency(value) {
    localStorage.setItem('swCurrency', JSON.stringify(value));
    store.dispatch(changeCurrency(value));
    this.setState({
      currency: value,
    });
  }

  changeCurrentCategory(value) {
    localStorage.setItem('swCategory', JSON.stringify(value));
    store.dispatch(changeCategory(value));
    this.setState({
      category: value,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  showCurrencies() {
    const dropdown = document.getElementById('dropdown');
    dropdown.classList.toggle('show-currencies');
  }

  render() {
    const {
      categories, currencies, currency, category, dataError,
    } = this.state;

    if (dataError) return <h2>Something went wrong.. Please reload the page</h2>;

    return (
      <header>
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

        <img src={shoppingBag} alt="shoppingbag" className="icon-shoppingbag" />

        <div className="cart-currency-container">
          <div className="currency-dropdown">
            <button type="button" onClick={this.showCurrencies} className="currency-dropdown-btn">{currency}</button>
            <div id="dropdown" className="currency-dropdown-content">
              { currencies.map(({ label, symbol }) => (
                <button
                  type="button"
                  onClick={({ target: { value } }) => this.changeCurrentCurrency(value)}
                  key={symbol}
                  value={symbol}
                >
                  {`${symbol} ${label}`}
                </button>
              ))}
            </div>
          </div>

          {/* <select onChange={({ target: { value } }) => this.changeCurrentCurrency(value)}>
            <option>{ currency }</option>
            { currencies.map(({ label, symbol }) => (
              <option key={symbol} value={symbol}>
                {`${symbol} ${label}`}
              </option>
            ))}
          </select> */}

          <img src={emptycart} alt="cart" className="icon-emptycart" />
        </div>
      </header>
    );
  }
}

export default Header;