import { Handler } from '@netlify/functions';
import { AxiosResponse } from 'axios';
import { gql, GraphQLClient } from 'graphql-request';
import { cashfreeAxiosInstance } from '../utils/cashfreeAxiosClient';
import { NHOST_BASE_URL } from '../utils/env.constants';
import { ORDER_STATUS } from '../utils/function.constants';
import { STATUS_CODES } from '../utils/status-codes.constants';
import { z } from 'zod';

const UPDATE_ORDER_BY_PK = gql`
  mutation updateOrderByPk($id: uuid!, $status: String = "PAID") {
    update_orders_by_pk(pk_columns: { id: $id }, _set: { status: $status }) {
      amount
      id
      status
      name
      house
      city
      pincode
      order_items {
        id
        quantity
        product {
          id
          image
          title
          price
        }
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

    const VerifyPaymentSchema = z.object({
      order_id: z.string().uuid(),
      order_token: z.string()
    });

    const result = VerifyPaymentSchema.safeParse(body);

    if (!result.success) {
      return {
        statusCode: STATUS_CODES.BAD_REQUEST,
        body: JSON.stringify(result.error.flatten())
      };
    }

    const { order_id, order_token } = result.data;

    try {
      // fetch order from cashfree

      const res: AxiosResponse<any> = await cashfreeAxiosInstance.get(
        `/orders/${order_id}`
      );
      //   console.log(JSON.stringify(res.data));

      if (res.data.order_token !== order_token) {
        return {
          statusCode: STATUS_CODES.BAD_REQUEST,
          body: JSON.stringify({
            message: 'order_token is invalid'
          })
        };
      }

      if (res.data.order_status !== ORDER_STATUS.PAID) {
        return {
          statusCode: STATUS_CODES.OK,
          body: JSON.stringify({
            id: order_id,
            status: ORDER_STATUS.PAYMENT_PENDING,
            payment_link: res.data.payment_link,
            message: 'Order is not paid. Please use the payment link to retry.'
          })
        };
      }

      // update order status in hasura
      const graphqlClient = new GraphQLClient(NHOST_BASE_URL);
      graphqlClient.setHeader(
        'Authorization',
        `${event.headers.authorization}`
      );

      const updateOrderResponse = await graphqlClient.request(
        UPDATE_ORDER_BY_PK,
        {
          id: order_id,
          status: ORDER_STATUS.PAID
        }
      );

      // console.log({ createOrderResponse });
      const { id, status } = updateOrderResponse.update_orders_by_pk;

      return {
        statusCode: STATUS_CODES.OK,
        body: JSON.stringify({
          id,
          status,
          message: 'Order is paid'
        })
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
