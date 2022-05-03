import {
  API_URL,
  LOCAL_STORAGE_ITEM_API_TOKEN,
  LOCAL_STORAGE_ITEM_IS_AUTHENTICATED
} from '@/constants/app.constants';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import React, { createContext, useContext } from 'react';
import { useHistory } from 'react-router-dom';

const AxiosContext = createContext<{
  axiosInstance: AxiosInstance;
  protectedAxiosInstance: AxiosInstance;
}>({
  axiosInstance: axios,
  protectedAxiosInstance: axios
});

interface AxiosProviderProps {
  children: React.ReactNode;
}

export const AxiosProvider: React.FC<AxiosProviderProps> = ({ children }) => {
  const history = useHistory();

  const axiosInstance = axios.create({
    baseURL: API_URL
  });

  const protectedAxiosInstance = axios.create({
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
        localStorage.setItem(LOCAL_STORAGE_ITEM_IS_AUTHENTICATED, 'false');
        // window.location.href = '/accounts/login';
        history.push('/accounts/login');
      }

      return Promise.reject(error);
    }
  );

  return (
    <AxiosContext.Provider value={{ axiosInstance, protectedAxiosInstance }}>
      {children}
    </AxiosContext.Provider>
  );
};

export const useAxiosInstance = () => {
  return useContext(AxiosContext);
};
