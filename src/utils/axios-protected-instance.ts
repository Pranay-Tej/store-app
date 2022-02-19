import {
  API_URL,
  LOCAL_STORAGE_ITEM_API_TOKEN
} from '@/constants/app.constants';
import axios from 'axios';
import { history } from '@/utils/history';

export const protectedAxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem(
      LOCAL_STORAGE_ITEM_API_TOKEN
    )}`
  }
});

protectedAxiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.message === 'Network Error') {
      console.error('Network Error');
    }

    const { status } = error.response;

    if (status === 401) {
      localStorage.removeItem(LOCAL_STORAGE_ITEM_API_TOKEN);
      // window.location.href = '/accounts/login';
      history.push('/accounts/login');
    }

    return Promise.reject(error);
  }
);
