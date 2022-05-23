import React, { PureComponent } from 'react';
import { Interweave } from 'interweave';
import Header from '../../components/Header/Header';
import client from '../../services/apolloClient/client';
import GET_PRODUCT_BY_ID from '../../services/graphqlQueries/getProductByIdQuery';
import store from '../../redux/store';

class ProductDescriptionPage extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      product: [],
      currency: '',
      dataError: false,
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
      });
    } catch (e) {
      this.setState({
        dataError: true,
      });
    }
  };

  render() {
    const { product, currency, dataError } = this.state;
    const {
      name, brand, description, gallery, attributes, prices,
    } = product;

    if (dataError) return <div>ERROOOO</div>;

    return (
      <div>
        <Header />

        <main>
          <div>
            {gallery && gallery.map((image) => (
              <img src={image} alt={name} style={{ width: '100px' }} />
            ))}
          </div>

          <div>
            <h3>{brand}</h3>
            <h3>{name}</h3>

            {attributes && attributes.map(({ name: attrName, type, items }) => (
              <>
                <h4>{attrName}</h4>
                <ul>
                  {type === 'swatch'
                    ? items.map(({ value }) => <li style={{ width: '32px', height: '32px', backgroundColor: value }} />)
                    : items.map(({ value }) => <li>{value}</li>)}
                </ul>
              </>
            ))}

            <h4>Price:</h4>
            { prices && prices.map(({ currency: { symbol }, amount }) => (
              symbol === currency && <p>{`${symbol}${amount}`}</p>
            ))}

            <button type="button">Add to cart</button>

            {description && <Interweave content={description} />}
          </div>
        </main>
      </div>
    );
  }
}

export default ProductDescriptionPage;
