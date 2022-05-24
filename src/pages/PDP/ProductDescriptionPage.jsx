import React, { PureComponent } from 'react';
import { Interweave } from 'interweave';
import Header from '../../components/Header/Header';
import client from '../../services/apolloClient/client';
import GET_PRODUCT_BY_ID from '../../services/graphqlQueries/getProductByIdQuery';
import store from '../../redux/store';
import './ProductDescriptionPage.css';

class ProductDescriptionPage extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      product: [],
      currency: '',
      dataError: false,
      selectedImg: '',
    };
  }

  componentDidMount() {
    this.fetchProduct();

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

  fetchProduct = async () => {
    const id = window.location.pathname.split('/')[2].toString();

    try {
      const { data: { product } } = await client.query(
        { query: GET_PRODUCT_BY_ID, variables: { id } },
      );

      this.setState({
        product,
        selectedImg: product.gallery[0],
      });
    } catch (e) {
      this.setState({
        dataError: true,
      });
    }
  };

  render() {
    const {
      product, currency, dataError, selectedImg,
    } = this.state;
    const {
      name, brand, description, gallery, attributes, prices,
    } = product;

    if (dataError) return <div>ERROOOO</div>;

    return (
      <div>
        <Header />

        <main className="product-description-container">
          <div className="product-imgs-container">
            <div className="product-imgs-wrapper">
              {gallery && gallery.map((image) => (
                <img className="product-imgs" src={image} alt={name} style={{ width: '100px' }} />
              ))}
            </div>
            <img className="selected-img" src={selectedImg} alt={name} />
          </div>

          <div>
            <h3 className="pdp-product-brand">{brand}</h3>
            <h3 className="pdp-product-name">{name}</h3>

            {attributes && attributes.map(({ name: attrName, type, items }) => (
              <>
                <h4 className="product-attr-name">{`${attrName}:`}</h4>
                <ul className="attr-option-container">
                  {type === 'swatch'
                    ? items.map(({ value }) => <li className="attr-swatch-option" style={{ backgroundColor: value }} />)
                    : items.map(({ value }) => <li className="attr-option">{value}</li>)}
                </ul>
              </>
            ))}

            <h4 className="product-attr-name">Price:</h4>
            { prices && prices.map(({ currency: { symbol }, amount }) => (
              symbol === currency && <p className="pdp-product-price">{`${symbol}${amount}`}</p>
            ))}

            <button type="button" className="add-to-cart-btn">Add to cart</button>

            {description && <Interweave className="product-description" content={description} />}
          </div>
        </main>
      </div>
    );
  }
}

export default ProductDescriptionPage;
