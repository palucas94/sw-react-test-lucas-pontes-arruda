import React, { Component } from 'react';
import { changeCategory } from '../redux/reducers/categorySlice';
import { changeCurrency } from '../redux/reducers/currencySlice';
import store from '../redux/store';
import client from '../services/apolloClient/client';
import GET_CATEGORIES from '../services/graphqlQueries/getCategoriesQuery';
import GET_CURRENCIES from '../services/graphqlQueries/getCurrenciesQuery';
import shoppingBag from '../icons/shoppingbag.png';
import emptycart from '../icons/emptycart.png';

class Header extends Component {
  constructor() {
    super();

    this.state = {
      categories: [],
      currencies: [],
      currency: '',
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
    } else {
      localStorage.setItem('swCategory', JSON.stringify('all'));
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
    this.setState();
  }

  render() {
    const {
      categories, currencies, currency, dataError,
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
            >
              {name.toUpperCase()}
            </button>
          ))}
        </nav>

        <img src={shoppingBag} alt="shoppingbag" style={{ width: '50px' }} />

        <div>
          <select onChange={({ target: { value } }) => this.changeCurrentCurrency(value)}>
            <option>{ currency }</option>
            { currencies.map(({ label, symbol }) => (
              <option key={symbol} value={symbol}>
                {`${symbol} ${label}`}
              </option>
            ))}
          </select>

          <img src={emptycart} alt="cart" style={{ width: '50px' }} />
        </div>
      </header>
    );
  }
}

export default Header;
