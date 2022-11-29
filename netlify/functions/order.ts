import { Handler } from '@netlify/functions';
import { AxiosResponse } from 'axios';
import { gql, GraphQLClient } from 'graphql-request';
import { cashfreeAxiosInstance } from '../utils/cashfreeAxiosClient';
import { NHOST_BASE_URL, REACT_APP_BASE_URL } from '../utils/env.constants';
import { ORDER_STATUS } from '../utils/function.constants';
import { STATUS_CODES } from '../utils/status-codes.constants';
import { z } from 'zod';

const INSERT_ORDERS_ONE = gql`
  mutation insertOrdersOne(
    $data: [order_items_insert_input!]!
    $status: String = "PAYMENT_PENDING"
    $amount: Int
    $name: String
    $mobile: numeric
    $house: String
    $street: String
    $landmark: String
    $city: String
    $pincode: numeric
  ) {
    insert_orders_one(
      object: {
        status: $status
        order_items: { data: $data }
        amount: $amount
        name: $name
        mobile: $mobile
        house: $house
        street: $street
        landmark: $landmark
        city: $city
        pincode: $pincode
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

const UPDATE_ORDER_BY_PK = gql`
  mutation updateOrderByPk(
    $id: uuid!
    $order_token: String
    $payment_link: String
  ) {
    update_orders_by_pk(
      pk_columns: { id: $id }
      _set: { payment_link: $payment_link, order_token: $order_token }
    ) {
      order_token
      payment_link
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

    const OrderSchema = z.object({
      customer_id: z.string(),
      order: z
        .object({
          product_id: z.string().uuid(),
          quantity: z.number().nonnegative(),
          price: z.number().nonnegative()
        })
        .array(),
      name: z.string().min(2).max(30),
      mobile: z.number(),
      house: z.string().min(3).max(30),
      street: z.string().min(3).max(30),
      landmark: z.union([z.string(), z.null()]),
      city: z.string().min(3).max(30),
      pincode: z.number()
    });

    const result = OrderSchema.safeParse(body);

    if (!result.success) {
      console.error(JSON.stringify(result.error.format()));
      return {
        statusCode: STATUS_CODES.BAD_REQUEST,
        body: JSON.stringify(result.error.flatten())
      };
    }

    const {
      customer_id,
      order,
      name,
      mobile,
      house,
      street,
      landmark,
      city,
      pincode
    } = result.data;

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
          status: ORDER_STATUS.PAYMENT_PENDING,
          amount: order_amount,
          name,
          mobile,
          house,
          street,
          landmark,
          city,
          pincode
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

      const updateOrderResponse = await graphqlClient.request(
        UPDATE_ORDER_BY_PK,
        {
          id: createOrderResponse.insert_orders_one.id,
          order_token: res.data.order_token,
          payment_link: res.data.payment_link
        }
      );

      return {
        statusCode: STATUS_CODES.CREATED,
        body: JSON.stringify(res.data)
      };
    } catch (error) {
      console.error(error);
      return {
        statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
        body: JSON.stringify(error)
      };
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
      body: JSON.stringify(error)
    };
  }
};

export { handler };
