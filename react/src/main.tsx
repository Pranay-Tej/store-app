import React from 'react';
import ReactDOM from 'react-dom';
import '@/index.css';
import App from '@/App';
import { AxiosProvider } from './context/axios.context';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/auth.context';
import { CartProvider } from './context/cart.context';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './utils/react-query-client';
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';

// dayjs plugins
// no need to extend in other files
// import dayjs from 'dayjs';
// import relativeTime from 'dayjs/plugin/relativeTime';

// dayjs.extend(relativeTime);

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <MantineProvider
        theme={{
          primaryColor: 'indigo',
          primaryShade: { light: 7 }
        }}
      >
        <NotificationsProvider>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <AxiosProvider>
                <CartProvider>
                  <App />
                  <ReactQueryDevtools initialIsOpen={false} />
                </CartProvider>
              </AxiosProvider>
            </AuthProvider>
          </QueryClientProvider>
        </NotificationsProvider>
      </MantineProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
