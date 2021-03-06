/* eslint-disable react/prop-types */
import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import store from '../../redux/store';
import { addToCartFromPLP } from '../../redux/reducers/cartSlice';
import emptycart from '../../icons/emptycart-white.png';
import './ProductCard.css';

class ProductCard extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      currency: '',
    };
  }

  componentDidMount() {
    this.setState({
      currency: store.getState().currency.currentCurrency,
    });

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
        id, brand, name, inStock, gallery, prices, attributes,
      },
    } = this.props;

    return (
      <div className="product-card">
        <Link to={`/product/${id}`}>
          <div className="product-img-container">
            <img src={gallery[0]} alt={name} className={inStock ? 'plp-img' : 'plp-img img-out-of-stock'} />
            { !inStock && <p className="text-out-of-stock">Out of stock</p> }
          </div>

          <div className="product-info-container">
            <h4 className="product-name">{`${brand} ${name}`}</h4>
            { prices.map(({ currency: { symbol }, amount }) => (
              symbol === currency && <p key={symbol} className="product-price">{`${symbol}${amount}`}</p>
            ))}
          </div>
        </Link>

        { inStock
        && (
        <button
          type="button"
          className="plp-add-to-cart-btn"
          onClick={() => store.dispatch(addToCartFromPLP({ id, attributes, prices }))}
        >
          <img src={emptycart} alt="add to cart button" />
        </button>
        )}
      </div>
    );
  }
}

export default ProductCard;
