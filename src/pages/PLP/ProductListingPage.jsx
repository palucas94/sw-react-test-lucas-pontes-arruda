/* eslint-disable react/destructuring-assignment */
/* eslint-disable class-methods-use-this */
import React, { PureComponent } from 'react';
import store from '../../redux/store';
import Header from '../../components/Header/Header';
import ProductCard from '../../components/ProductCard/ProductCard';
import './ProductListingPage.css';
import { changeCategory } from '../../redux/reducers/categorySlice';
import GET_PRODUCTS from '../../services/graphqlQueries/getProductsQuery';
import client from '../../services/apolloClient/client';

class ProductListingPage extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      category: '',
      products: [],
    };
  }

  componentDidMount() {
    const category = window.location.pathname.split('/')[1].toString();
    store.dispatch(changeCategory(category));
    this.fetchProducts(category);

    this.setState({
      category,
    });

    store.subscribe(() => {
      this.setState({
        category: store.getState().category.currentCategory,
      }, () => this.fetchProducts(this.state.category));
    });
  }

  async fetchProducts(name) {
    const { data: { category: { products } } } = await client.query(
      { query: GET_PRODUCTS, variables: { title: name } },
    );

    this.setState({
      products,
    });
  }

  render() {
    const { category, products } = this.state;

    return (
      <div>
        <Header />

        <div id="background-cover" />

        <main>
          <h1 className="category-name">{ category }</h1>

          <section className="product-listing-container">
            { products.map((p) => <ProductCard key={p.name} product={p} />)}
          </section>
        </main>
      </div>
    );
  }
}

export default ProductListingPage;
