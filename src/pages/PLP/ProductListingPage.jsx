import React, { PureComponent } from 'react';
import Header from '../../components/Header/Header';
import ProductCard from '../../components/ProductCard/ProductCard';
import store from '../../redux/store';
import client from '../../services/apolloClient/client';
import GET_PRODUCTS from '../../services/graphqlQueries/getProductsQuery';
import './ProductListingPage.css';

class ProductListingPage extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      categories: [],
      category: store.getState().category.currentCategory,
      dataError: false,
    };
  }

  componentDidMount() {
    this.fetchProducts();

    store.subscribe(() => {
      this.setState({
        category: store.getState().category.currentCategory,
      });
    });
  }

  fetchProducts = async () => {
    try {
      const { data: { categories } } = await client.query({ query: GET_PRODUCTS });
      this.setState({
        categories,
      });
    } catch (e) {
      this.setState({
        dataError: true,
      });
    }
  };

  render() {
    const { category, categories, dataError } = this.state;

    if (dataError) return <h2>Something went wrong.. Please reload the page</h2>;

    return (
      <div>
        <Header />

        <h1 className="category-name">{ category }</h1>

        <main className="product-listing-container">
          { categories.map(({ name, products }) => (
            name === category && products.map((product) => (
              <ProductCard key={product.name} product={product} />
            ))
          ))}
        </main>
      </div>
    );
  }
}

export default ProductListingPage;
