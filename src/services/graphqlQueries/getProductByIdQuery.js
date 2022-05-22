import { gql } from '@apollo/client';

const GET_PRODUCT_BY_ID = gql`
  query getProductById($id: String!) {
    product(id: $id) {
      name
      gallery
      description
      attributes {
        id
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
  }`;

export default GET_PRODUCT_BY_ID;
