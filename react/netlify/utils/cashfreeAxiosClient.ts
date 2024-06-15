import axios from 'axios';
import {
  CASHFREE_BASE_URL,
  CASHFREE_CLIENT_ID,
  CASHFREE_CLIENT_SECRET
} from './env.constants';

export const cashfreeAxiosInstance = axios.create({
  baseURL: CASHFREE_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-version': '2022-01-01',
    'x-client-id': CASHFREE_CLIENT_ID,
    'x-client-secret': CASHFREE_CLIENT_SECRET
  }
});
