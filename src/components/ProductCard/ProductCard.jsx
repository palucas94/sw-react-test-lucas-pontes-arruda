/* eslint-disable react/prop-types */
import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import store from '../../redux/store';
import './ProductCard.css';

class ProductCard extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      currency: '',
    };
  }

  componentDidMount() {
    const currentCurrency = JSON.parse(localStorage.getItem('swCurrency'));
    if (currentCurrency) {
      this.setState({
        currency: currentCurrency,
      });
    } else {
      this.setState({
        currency: '$',
      });
    }

    store.subscribe(() => {
      this.setState({
        currency: store.getState().currency.currentCurrency,
      });
    });
  }

  render() {
    const { currency } = this.state;
    const {
      product: {
        id, brand, name, inStock, gallery, prices,
      },
    } = this.props;

    return (
      <Link to={`/product/${id}`} className="product-card">
        <div className="product-img-container">
          <img src={gallery[0]} alt={name} className={inStock ? '' : 'img-out-of-stock'} />
          { !inStock && <p className="text-out-of-stock">Out of stock</p> }
        </div>
        <div className="product-info-container">
          <h4 className="product-name">{`${brand} ${name}`}</h4>
          { prices.map(({ currency: { symbol }, amount }) => (
            symbol === currency && <p key={symbol} className="product-price">{`${symbol}${amount}`}</p>
          ))}
        </div>
      </Link>
    );
  }
}

export default ProductCard;
