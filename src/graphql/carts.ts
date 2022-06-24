import { gql } from 'graphql-request';

export const GET_CART_ITEMS = gql`
  query cartItems($customer_id: String) {
    cart_items(
      where: { customer_id: { _eq: $customer_id } }
      order_by: { created_at: asc }
    ) {
      product {
        description
        id
        image
        price
        title
      }
      quantity
    }
  }
`;

export const GET_CART_ITEM = gql`
  subscription cartItem($customer_id: String, $product_id: uuid) {
    cart_items(
      where: {
        _and: {
          customer_id: { _eq: $customer_id }
          product_id: { _eq: $product_id }
        }
      }
    ) {
      product {
        description
        id
        image
        price
        title
      }
      quantity
    }
  }
`;

export const INSERT_CART_ITEMS_ONE = gql`
  mutation insertCartItemsOne($product_id: uuid, $quantity: Int) {
    insert_cart_items_one(
      object: { product_id: $product_id, quantity: $quantity }
    ) {
      product_id
      quantity
    }
  }
`;

export const UPDATE_CART_ITEM = gql`
  mutation updateCartItem(
    $customer_id: String
    $product_id: uuid
    $quantity: Int
  ) {
    update_cart_items(
      where: {
        _and: {
          customer_id: { _eq: $customer_id }
          product_id: { _eq: $product_id }
        }
      }
      _set: { quantity: $quantity }
    ) {
      returning {
        quantity
        product_id
      }
    }
  }
`;

export const DELETE_CART_ITEM = gql`
  mutation deleteCartItem($product_id: uuid, $customer_id: String) {
    delete_cart_items(
      where: {
        _and: {
          customer_id: { _eq: $customer_id }
          product_id: { _eq: $product_id }
        }
      }
    ) {
      affected_rows
      returning {
        product_id
        quantity
      }
    }
  }
`;

export const CLEAR_CART = gql`
  mutation clearCart($customer_id: String) {
    delete_cart_items(where: { customer_id: { _eq: $customer_id } }) {
      affected_rows
    }
  }
`;
