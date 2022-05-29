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
    const { selectedAttrs } = this.props;

    if (type === 'swatch') {
      const isSelected = selectedAttrs.attributes.find(
        ({ name, value }) => name === attrName && value === attrValue,
      );

      if (isSelected) return 'attr-swatch-option attr-selected-swatch';
      return 'attr-swatch-option';
    }

    const isSelected = selectedAttrs.attributes.find(
      ({ name, value }) => name === attrName && value === attrValue,
    );
    if (isSelected) return 'attr-option attr-selected-option';
    return 'attr-option';
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
    const { selectedAttrs } = this.props;
    const { qty } = selectedAttrs;

    return (
      <div>
        <div className="cart-product-container">
          <div>
            <h3 className="cart-product-brand">{ brand }</h3>
            <h3 className="cart-product-name">{ name }</h3>

            { prices && prices.map(({ currency: { symbol }, amount }) => (
              symbol === currency && <p key={symbol} className="cart-product-price">{`${symbol}${amount * qty}`}</p>))}

            { attributes && attributes.map(({ name: attrName, type, items }) => (
              <>
                <h4 className="cart-attr-name">{`${attrName}:`}</h4>
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
          <div className="cart-img-buttons-wrapper">
            <div className="cart-buttons-wrapper">
              <button
                type="button"
                className="cart-increment-button"
                onClick={() => store.dispatch(incProductQty(selectedAttrs))}
              >
                +
              </button>
              <p className="cart-product-qty">{ qty }</p>
              <button
                type="button"
                className="cart-decrement-button"
                onClick={() => store.dispatch(decProductQty(selectedAttrs))}
              >
                -
              </button>
            </div>
            <img className="cart-product-img" src={gallery && gallery[0]} alt={name} />
          </div>
        </div>
        <div className="cart-separating-line" />
      </div>
    );
  }
}

export default CartProductCard;
