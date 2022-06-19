import { API_URL } from '@/constants/app.constants';
import { LOCAL_STORAGE_KEYS } from '@/constants/local-storage-keys.constants';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import React, { createContext, useContext } from 'react';
import { useAuthContext } from './auth.context';

const AxiosContext = createContext<{
  axiosInstance: AxiosInstance;
  protectedAxiosInstance: AxiosInstance;
}>({
  axiosInstance: axios,
  protectedAxiosInstance: axios
});

export const AxiosProvider: React.FC<React.ReactNode> = ({ children }) => {
  const { logout } = useAuthContext();

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
      const token = localStorage.getItem(LOCAL_STORAGE_KEYS.API_TOKEN);
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
        logout();
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
