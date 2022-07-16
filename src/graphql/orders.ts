import { gql } from 'graphql-request';

export const GET_ORDERS = gql`
  query getOrders($customer_id: String) {
    orders(
      where: { customer_id: { _eq: $customer_id } }
      order_by: { created_at: desc }
    ) {
      created_at
      id
      amount
      status
      address {
        city
        name
        mobile
        landmark
        house
        pincode
        street
      }
      order_items {
        id
        quantity
        product {
          id
          image
          price
          title
        }
      }
    }
  }
`;

export const GET_ORDERS_BY_PK = gql`
  query getOrderByPk($id: uuid!) {
    orders_by_pk(id: $id) {
      created_at
      id
      amount
      status
      address {
        city
        name
        mobile
        landmark
        house
        pincode
        street
      }
      order_items {
        id
        quantity
        product {
          id
          image
          price
          title
        }
      }
    }
  }
`;
