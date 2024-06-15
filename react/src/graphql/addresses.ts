import { gql } from 'graphql-request';

export const GET_ADDRESSES = gql`
  query getAddresses($customer_id: String) {
    addresses(where: { customer_id: { _eq: $customer_id } }) {
      id
      pincode
      city
      street
      house
      landmark
      mobile
      name
    }
  }
`;

export const GET_ADDRESS_BY_PK = gql`
  query getAddressByPk($id: uuid!) {
    addresses_by_pk(id: $id) {
      id
      pincode
      city
      street
      house
      landmark
      mobile
      name
    }
  }
`;

export const INSERT_ADDRESS = gql`
  mutation insertAddress($address_input: addresses_insert_input!) {
    insert_addresses_one(object: $address_input) {
      city
      house
      id
      landmark
      mobile
      name
      pincode
      street
    }
  }
`;

export const UPDATE_ADDRESS_BY_PK = gql`
  mutation updateAddressByPk($address_input: addresses_set_input, $id: uuid!) {
    update_addresses_by_pk(pk_columns: { id: $id }, _set: $address_input) {
      city
      house
      id
      landmark
      mobile
      name
      pincode
      street
    }
  }
`;

export const DELETE_ADDRESS_BY_PK = gql`
  mutation deleteAddressByPk($id: uuid!) {
    delete_addresses_by_pk(id: $id) {
      id
    }
  }
`;
