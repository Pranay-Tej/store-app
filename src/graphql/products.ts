import { gql } from 'graphql-request';

export const GET_PRODUCTS = gql`
  query getProducts {
    products {
      description
      id
      image
      title
      price
    }
  }
`;

export const GET_PRODUCT_BY_PK = gql`
  query getProductByPk($id: uuid!) {
    products_by_pk(id: $id) {
      id
      description
      image
      price
      title
    }
  }
`;
