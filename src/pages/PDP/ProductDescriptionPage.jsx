import React, { PureComponent } from 'react';
import { Interweave } from 'interweave';

import client from '../../services/apolloClient/client';
import GET_PRODUCT_BY_ID from '../../services/graphqlQueries/getProductByIdQuery';

import store from '../../redux/store';
import { addToCart, setCurrentProductAttributes, setInitialProductAttributes } from '../../redux/reducers/cartSlice';

import Header from '../../components/Header/Header';
import './ProductDescriptionPage.css';

class ProductDescriptionPage extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      product: [],
      currency: '',
      selectedImg: '',
      currentAttrs: [],
      dataError: false,
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
        currentAttrs: store.getState().cart.currentProduct.attributes,
      });
    });
  }

  getClassName(type, attrName, attrValue) {
    const { currentAttrs } = this.state;

    if (type === 'swatch') {
      const isSelected = currentAttrs.find(
        ({ name, value }) => name === attrName && value === attrValue,
      );

      if (isSelected) return 'attr-swatch-option attr-selected-swatch';
      return 'attr-swatch-option';
    }

    const isSelected = currentAttrs.find(
      ({ name, value }) => name === attrName && value === attrValue,
    );
    if (isSelected) return 'attr-option attr-selected-option';
    return 'attr-option';
  }

  changeSelectedImg({ target: { src } }) {
    this.setState({
      selectedImg: src,
    });
  }

  async fetchProduct() {
    const id = window.location.pathname.split('/')[2].toString();

    try {
      const { data: { product } } = await client.query(
        { query: GET_PRODUCT_BY_ID, variables: { id } },
      );

      store.dispatch(setInitialProductAttributes({ id, product }));

      this.setState({
        product,
        selectedImg: product.gallery[0],
      });
    } catch (e) {
      this.setState({
        dataError: true,
      });
    }
  }

  render() {
    const {
      product, currency, dataError, selectedImg,
    } = this.state;
    const {
      name, brand, description, gallery, attributes, prices, inStock,
    } = product;

    if (dataError) return <p>Something went wrong. Please reload the page...</p>;

    return (
      <div>
        <Header />

        <div id="background-cover" />

        <main className="product-description-container">
          <section className="product-imgs-container">
            <div className="product-imgs-wrapper">
              {gallery && gallery.map((image) => (
                <button className="product-imgs" type="button" onClick={(e) => this.changeSelectedImg(e)}>
                  <img
                    key={image}
                    src={image}
                    alt={name}
                  />
                </button>
              ))}
            </div>
            <img className="selected-img" src={selectedImg} alt={name} />
          </section>

          <section>
            <h2 className="pdp-product-brand">{brand}</h2>
            <h3 className="pdp-product-name">{name}</h3>

            {attributes && attributes.map(({ name: attrName, type, items }) => (
              <>
                <h4 className="product-attr-name">{`${attrName}:`}</h4>
                <div className="attr-option-container">
                  {type === 'swatch'
                    ? items.map(({ value }) => (
                      <button
                        aria-label="Color Option"
                        key={value}
                        type="button"
                        className={this.getClassName(type, attrName, value)}
                        style={{ backgroundColor: value }}
                        onClick={() => store.dispatch(
                          setCurrentProductAttributes({ name: attrName, type, value }),
                        )}
                      />
                    ))
                    : items.map(({ value }) => (
                      <button
                        key={value}
                        type="button"
                        className={this.getClassName(type, attrName, value)}
                        onClick={() => store.dispatch(
                          setCurrentProductAttributes({ name: attrName, type, value }),
                        )}
                      >
                        {value}
                      </button>
                    ))}
                </div>
              </>
            ))}

            <h4 className="product-attr-name">Price:</h4>
            { prices && prices.map(({ currency: { symbol }, amount }) => (
              symbol === currency && <p key={symbol} className="pdp-product-price">{`${symbol}${amount}`}</p>
            ))}

            <button
              type="button"
              className={inStock ? 'add-to-cart-btn' : 'add-to-cart-btn out-of-stock-btn'}
              disabled={!inStock}
              onClick={() => store.dispatch(addToCart())}
            >
              Add to cart
            </button>

            {description
            && (
              <div className="product-description">
                <Interweave content={description} />
              </div>
            )}
          </section>
        </main>
      </div>
    );
  }
}

export default ProductDescriptionPage;
