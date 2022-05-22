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
        brand, name, inStock, gallery, prices,
      },
    } = this.props;

    return (
      <Link to={`/product/${brand}${name}`}>
        <img src={gallery[0]} alt={name} className={inStock ? '' : 'outOfStock'} style={{ width: '200px' }} />
        <h4>{`${brand} ${name}`}</h4>
        { prices.map(({ currency: { symbol }, amount }) => (
          symbol === currency && <p>{`${symbol}${amount}`}</p>
        ))}
      </Link>
    );
  }
}

export default ProductCard;
