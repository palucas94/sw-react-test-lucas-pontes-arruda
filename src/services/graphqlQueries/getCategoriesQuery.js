import { gql } from '@apollo/client';

const GET_CATEGORIES = gql`
  query getCategories {
    categories {
      name
    }
  }`;

export default GET_CATEGORIES;
