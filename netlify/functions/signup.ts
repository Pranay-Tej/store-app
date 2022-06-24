import { Handler } from '@netlify/functions';
import axios, { AxiosResponse } from 'axios';
import { gql, GraphQLClient } from 'graphql-request';
import {
  NHOST_BASE_URL,
  SHIRUDO_APP_ID,
  SHIRUDO_BASE_URL
} from '../utils/env.constants';
import { STATUS_CODES } from '../utils/status-codes.constants';

const REGISTER_USER_MUTATION = gql`
  mutation register_customer {
    insert_customers_one(object: {}) {
      id
      hasura_id
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
    const { username, password } = body;

    if (!username || !password) {
      return {
        statusCode: STATUS_CODES.BAD_REQUEST,
        body: JSON.stringify({
          message: 'Username and password are required'
        })
      };
    }

    try {
      const res: AxiosResponse<{
        jwt: string;
      }> = await axios.post(`${SHIRUDO_BASE_URL}/users/register`, {
        username,
        password,
        app_id: SHIRUDO_APP_ID
      });

      const graphqlClient = new GraphQLClient(NHOST_BASE_URL);
      graphqlClient.setHeader('Authorization', `Bearer ${res.data.jwt}`);

      const userRegisterResponse = await graphqlClient.request(
        REGISTER_USER_MUTATION
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
