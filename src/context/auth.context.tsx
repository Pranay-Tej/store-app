import { SHIRUDO_APP_ID, SHIRUDO_BASE_URL } from '@/constants/app.constants';
import { LOCAL_STORAGE_KEYS } from '@/constants/local-storage-keys.constants';
import axios, { AxiosResponse } from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

interface IAuthContext {
  isAuthenticated: boolean;
  userId: string | undefined;
  username: string | undefined;
  verifyUser: (jwt: string) => void;
  // setAuthState: (jwt: string, userId: string, username: string) => void;
  logout: () => void;
}

const AuthContext = createContext({} as IAuthContext);

export const AuthProvider: React.FC<React.ReactNode> = ({ children }) => {
  const history = useHistory();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>();
  const [username, setUsername] = useState<string>();

  useEffect(() => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.API_TOKEN);
    if (token) {
      verifyUser(token);

      setUserId(localStorage.getItem(LOCAL_STORAGE_KEYS.USER_ID) as string);
      setUsername(localStorage.getItem(LOCAL_STORAGE_KEYS.USERNAME) as string);
      setIsAuthenticated(true);
    }
  }, []);

  const verifyUser = async (jwt: string) => {
    try {
      const {
        data: userData
      }: AxiosResponse<{ user: { _id: string; username: string } }> =
        await axios.get(`${SHIRUDO_BASE_URL}/users/verify`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
            ShirudoAppId: SHIRUDO_APP_ID
          }
        });
      setAuthState(jwt, userData?.user?._id, userData?.user?.username);
    } catch (error) {
      logout();
    }
  };
  const setAuthState = async (
    jwt: string,
    userId: string,
    username: string
  ) => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.API_TOKEN, jwt);
    localStorage.setItem(LOCAL_STORAGE_KEYS.IS_AUTHENTICATED, 'true');
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER_ID, userId);
    localStorage.setItem(LOCAL_STORAGE_KEYS.USERNAME, username);
    setUserId(userId);
    setUsername(username);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.API_TOKEN);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_ID);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USERNAME);
    localStorage.setItem(LOCAL_STORAGE_KEYS.IS_AUTHENTICATED, 'false');
    setUserId(undefined);
    setUsername(undefined);
    setIsAuthenticated(false);
    history.push('/accounts/login');
  };

  return (
    <AuthContext.Provider
      value={{
        userId,
        username,
        verifyUser,
        isAuthenticated,
        // setAuthState,
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
