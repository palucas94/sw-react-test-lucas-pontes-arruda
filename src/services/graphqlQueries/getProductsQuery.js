import { gql } from '@apollo/client';

const GET_PRODUCTS = gql`
  query getProducts {
    categories{
    name
    products {
      id
      __typename @skip(if: true)
      name
      inStock
      gallery
      description
      category
      attributes {
        id
        __typename @skip(if: true)
        name
        type
        items {
          displayValue
          value
          id
        }
      }
      prices {
        currency {
          label
          symbol
        }
        amount
      }
      brand
    }
  }
}`;

export default GET_PRODUCTS;
