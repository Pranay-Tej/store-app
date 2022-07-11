import { Handler } from '@netlify/functions';
import { AxiosResponse } from 'axios';
import { gql, GraphQLClient } from 'graphql-request';
import { cashfreeAxiosInstance } from '../utils/cashfreeAxiosClient';
import { NHOST_BASE_URL, REACT_APP_BASE_URL } from '../utils/env.constants';
import { STATUS_CODES } from '../utils/status-codes.constants';

const INSERT_ORDERS_ONE = gql`
  mutation insertOrdersOne(
    $data: [order_items_insert_input!]!
    $status: String = "PENDING"
    $amount: Int
    $address_id: uuid!
  ) {
    insert_orders_one(
      object: {
        status: $status
        order_items: { data: $data }
        amount: $amount
        address_id: $address_id
      }
    ) {
      customer_id
      id
      status
      order_items {
        id
        product_id
        quantity
      }
    }
  }
`;

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

const handler: Handler = async (event, context) => {
  try {
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers
      };
    }

    const body = JSON.parse(event.body || '{}');
    const { customer_id, order, address_id } = body;

    if (!customer_id || !order || !address_id) {
      return {
        statusCode: STATUS_CODES.BAD_REQUEST,
        body: JSON.stringify({
          message: 'customer_id, order & address_id are required'
        })
      };
    }

    const order_amount = order.reduce((acc, curr) => {
      return acc + curr.quantity * curr.price;
    }, 0);

    const order_items = order.map(item => {
      return {
        product_id: item.product_id,
        quantity: item.quantity
      };
    });

    try {
      // create order in hasura
      const graphqlClient = new GraphQLClient(NHOST_BASE_URL);
      graphqlClient.setHeader(
        'Authorization',
        `${event.headers.authorization}`
      );

      const createOrderResponse = await graphqlClient.request(
        INSERT_ORDERS_ONE,
        {
          data: order_items,
          status: 'PENDING',
          amount: order_amount,
          address_id
        }
      );

      if (!createOrderResponse?.insert_orders_one?.id) {
        throw new Error('Order creation failed');
      }

      // create order in cashfree
      var data = JSON.stringify({
        order_id: createOrderResponse.insert_orders_one.id,
        order_amount,
        order_currency: 'INR',
        customer_details: {
          customer_id,
          customer_email: `${customer_id}@shirudostore.com`,
          customer_phone: '9816512345'
        },
        order_meta: {
          return_url: `${REACT_APP_BASE_URL}/payment?order_id={order_id}&order_token={order_token}`
        }
      });

      const res: AxiosResponse<any> = await cashfreeAxiosInstance.post(
        `/orders`,
        data
      );

      return {
        statusCode: STATUS_CODES.CREATED,
        body: JSON.stringify(res.data)
      };
    } catch (error) {
      console.error(error);
      return {
        statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: JSON.stringify(error)
      };
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
      body: JSON.stringify({
        error: error.message
      })
    };
  }
};

export { handler };
