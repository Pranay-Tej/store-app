import { FAKE_STORE_API_BASE_URL } from '@/constants/app.constants';
import { LOCAL_STORAGE_KEYS } from '@/constants/local-storage-keys.constants';
import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  login: () => Promise.resolve(),
  logout: () => {}
  //   register: () => Promise.resolve()
});

export const AuthProvider: React.FC<React.ReactNode> = ({ children }) => {
  const history = useHistory();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.API_TOKEN);
    if (token) {
      setIsAuthenticated(true);
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
      localStorage.setItem(LOCAL_STORAGE_KEYS.API_TOKEN, res.data.token);
      localStorage.setItem(LOCAL_STORAGE_KEYS.IS_AUTHENTICATED, 'true');
      setIsAuthenticated(true);
    } catch (error) {
      console.error(error);
    }
  };

  const logout = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.API_TOKEN);
    localStorage.setItem(LOCAL_STORAGE_KEYS.IS_AUTHENTICATED, 'false');
    setIsAuthenticated(false);
    setUser(null);
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
