/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import { decProductQty, incProductQty } from '../../redux/reducers/cartSlice';
import store from '../../redux/store';
import client from '../../services/apolloClient/client';
import GET_PRODUCT_BY_ID from '../../services/graphqlQueries/getProductByIdQuery';
import './CartProductCard.css';

class CartProductCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      product: '',
      currency: '',
    };
  }

  componentDidMount() {
    this.fetchProduct();
    this.setState({
      currency: store.getState().currency.currentCurrency,
    });

    store.subscribe(() => {
      this.setState({
        currency: store.getState().currency.currentCurrency,
      });
    });
  }

  getClassName(type, attrName, attrValue) {
    const { origin, selectedAttrs } = this.props;

    if (type === 'swatch') {
      const isSelected = selectedAttrs.attributes.find(
        ({ name, value }) => name === attrName && value === attrValue,
      );

      if (isSelected) {
        return `${origin === 'overlay' ? 'overlay-swatch-option attr-selected-swatch' : 'attr-swatch-option attr-selected-swatch'}`;
      }
      return `${origin === 'overlay' ? 'overlay-swatch-option' : 'attr-swatch-option'}`;
    }

    const isSelected = selectedAttrs.attributes.find(
      ({ name, value }) => name === attrName && value === attrValue,
    );

    if (isSelected) return `${origin === 'overlay' ? 'overlay-attr-option attr-selected-option' : 'attr-option attr-selected-option'}`;
    return `${origin === 'overlay' ? 'overlay-attr-option' : 'attr-option'}`;
  }

  async fetchProduct() {
    const { selectedAttrs: { id } } = this.props;
    const { data: { product } } = await client.query(
      { query: GET_PRODUCT_BY_ID, variables: { id } },
    );
    this.setState({
      product,
    });
  }

  render() {
    const { product, currency } = this.state;
    const {
      name, brand, attributes, prices, gallery,
    } = product;
    const { origin, selectedAttrs } = this.props;
    const { qty } = selectedAttrs;

    return (
      <div>
        <div className={origin === 'overlay' ? 'overlay-product-container' : 'cart-product-container'}>
          <div>
            <h3 className={origin === 'overlay' ? 'overlay-product-brand' : 'cart-product-brand'}>{ brand }</h3>
            <h3 className={origin === 'overlay' ? 'overlay-product-name' : 'cart-product-name'}>{ name }</h3>

            { prices && prices.map(({ currency: { symbol }, amount }) => (
              symbol === currency
                && (
                <p
                  key={symbol}
                  className={origin === 'overlay' ? 'overlay-product-price' : 'cart-product-price'}
                >
                  {`${symbol}${(amount * qty).toFixed(2)}`}
                </p>
                )))}

            { attributes && attributes.map(({ name: attrName, type, items }) => (
              <>
                <h4 className={origin === 'overlay' ? 'overlay-attr-name' : 'cart-attr-name'}>{`${attrName}:`}</h4>
                <div className="attr-option-container">
                  {type === 'swatch'
                    ? items.map(({ value }) => (
                      <button
                        aria-label="Color Option"
                        key={value}
                        type="button"
                        className={this.getClassName(type, attrName, value)}
                        style={{ backgroundColor: value }}
                      />
                    ))
                    : items.map(({ value }) => (
                      <button
                        key={value}
                        type="button"
                        className={this.getClassName(type, attrName, value)}
                      >
                        {value}
                      </button>
                    ))}
                </div>
              </>
            ))}

          </div>

          <div className={origin === 'overlay' ? 'overlay-img-buttons-wrapper' : 'cart-img-buttons-wrapper'}>
            <div className={origin === 'overlay' ? 'overlay-buttons-wrapper' : 'cart-buttons-wrapper'}>
              <button
                type="button"
                className={origin === 'overlay' ? 'overlay-increment-button' : 'cart-increment-button'}
                onClick={() => store.dispatch(incProductQty(selectedAttrs))}
              >
                <div className={origin === 'overlay' ? 'overlay-horizontal-line' : 'horizontal-line'} />
                <div className={origin === 'overlay' ? 'overlay-vertical-line' : 'vertical-line'} />
              </button>
              <p className={origin === 'overlay' ? 'overlay-product-qty' : 'cart-product-qty'}>{ qty }</p>
              <button
                type="button"
                className={origin === 'overlay' ? 'overlay-decrement-button' : 'cart-decrement-button'}
                onClick={() => store.dispatch(decProductQty(selectedAttrs))}
              >
                <div className={origin === 'overlay' ? 'overlay-horizontal-line' : 'horizontal-line'} />
              </button>
            </div>

            <img
              className={origin === 'overlay' ? 'overlay-product-img' : 'cart-product-img'}
              src={gallery && gallery[0]}
              alt={name}
            />

          </div>
        </div>
        <div className={origin === 'overlay' ? 'overlay-separating-line' : 'cart-separating-line'} />
      </div>
    );
  }
}

export default CartProductCard;
