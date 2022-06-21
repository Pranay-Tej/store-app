import { LOCAL_STORAGE_KEYS } from '@/constants/local-storage-keys.constants';
import { useAuthContext } from '@/context/auth.context';
import { useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
export function ProtectedRoute({ children, ...rest }: any) {
  const { isAuthenticated, verifyUser } = useAuthContext();

  useEffect(() => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.API_TOKEN);
    if (token) {
      verifyUser(token);
    }
  }, []);

  return (
    <Route
      {...rest}
      render={({ location }) => {
        return isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/accounts/login',
              state: { from: location }
            }}
          />
        );
      }}
    />
  );
}
