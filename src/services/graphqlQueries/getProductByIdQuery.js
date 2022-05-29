import { gql } from '@apollo/client';

const GET_PRODUCT_BY_ID = gql`
  query getProductById($id: String!) {
    product(id: $id) {
      name
      gallery
      description
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
      inStock
    }
  }`;

export default GET_PRODUCT_BY_ID;
