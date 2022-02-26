import {
  API_URL,
  LOCAL_STORAGE_ITEM_API_TOKEN
} from '@/constants/app.constants';
import axios, { AxiosRequestConfig } from 'axios';
import { history } from '@/utils/history';

export const protectedAxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request authentication interceptor as it can change at any time
protectedAxiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem(LOCAL_STORAGE_ITEM_API_TOKEN);
    if (token) {
      config = {
        ...config,
        headers: { ...config.headers, Authorization: `Bearer ${token}` }
      };
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

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
