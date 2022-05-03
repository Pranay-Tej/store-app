import React from 'react';
import ReactDOM from 'react-dom';
import '@/index.css';
import App from '@/App';
import { AxiosProvider } from './context/axios.context';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/auth.context';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AxiosProvider>
          <App />
        </AxiosProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
