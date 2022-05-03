import {
  FAKE_STORE_API_BASE_URL,
  LOCAL_STORAGE_ITEM_API_TOKEN,
  LOCAL_STORAGE_ITEM_IS_AUTHENTICATED
} from '@/constants/app.constants';
import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

interface IAuthContext {
  isAuthenticated: boolean;
  user: any;
  //   token: string;
  login: () => Promise<any>;
  logout: () => void;
  //   register(user: any): Promise<any>;
}

const AuthContext = createContext<IAuthContext>({
  isAuthenticated: false,
  user: null,
  //   token: '',
  login: () => Promise.resolve(),
  logout: () => {}
  //   register: () => Promise.resolve()
});

export const AuthProvider: React.FC<React.ReactNode> = ({ children }) => {
  const history = useHistory();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');

  useEffect(() => {
    const token = localStorage.getItem(LOCAL_STORAGE_ITEM_API_TOKEN);
    if (token) {
      setIsAuthenticated(true);
      setToken(token);
    }
  }, []);

  const login = async () => {
    try {
      const res = await axios.post<{ token: string }>(
        `${FAKE_STORE_API_BASE_URL}/auth/login`,
        {
          username: 'mor_2314',
          password: '83r5^_'
        }
      );
      setIsAuthenticated(true);
      setToken(res.data.token);
      localStorage.setItem(LOCAL_STORAGE_ITEM_API_TOKEN, res.data.token);
      localStorage.setItem(LOCAL_STORAGE_ITEM_IS_AUTHENTICATED, 'true');
    } catch (error) {
      console.error(error);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setToken('');
    localStorage.removeItem(LOCAL_STORAGE_ITEM_API_TOKEN);
    localStorage.setItem(LOCAL_STORAGE_ITEM_IS_AUTHENTICATED, 'false');
    history.push('/accounts/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
