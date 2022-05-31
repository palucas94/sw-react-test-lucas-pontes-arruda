import React, { PureComponent } from 'react';
import store from '../../redux/store';
import Header from '../../components/Header/Header';
import ProductCard from '../../components/ProductCard/ProductCard';
import './ProductListingPage.css';

class ProductListingPage extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      products: [],
      category: '',
    };
  }

  componentDidMount() {
    this.setState({
      products: store.getState().cart.allProducts,
      category: store.getState().category.currentCategory,
    });

    store.subscribe(() => {
      this.setState({
        products: store.getState().cart.allProducts,
        category: store.getState().category.currentCategory,
      });
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
            { category === 'all'
              ? products.map((p) => <ProductCard key={p.name} product={p} />)
              : products.map((p) => (
                p.category === category && <ProductCard key={p.name} product={p} />
              ))}
          </section>
        </main>
      </div>
    );
  }
}

export default ProductListingPage;
