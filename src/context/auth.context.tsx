import { LOCAL_STORAGE_KEYS } from '@/constants/local-storage-keys.constants';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  setAuthState: (jwt: string) => {},
  logout: () => {}
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

  const setAuthState = async (jwt: string) => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.API_TOKEN, jwt);
    localStorage.setItem(LOCAL_STORAGE_KEYS.IS_AUTHENTICATED, 'true');
    setIsAuthenticated(true);
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
        setAuthState,
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
