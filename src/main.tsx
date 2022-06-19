import React from 'react';
import ReactDOM from 'react-dom';
import '@/index.css';
import App from '@/App';
import { AxiosProvider } from './context/axios.context';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/auth.context';
import { CartProvider } from './context/cart.context';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { GraphqlClientProvider } from './context/graphql-client.context';

const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <GraphqlClientProvider>
            <AxiosProvider>
              <CartProvider>
                <App />
                <ReactQueryDevtools initialIsOpen={false} />
              </CartProvider>
            </AxiosProvider>
          </GraphqlClientProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
