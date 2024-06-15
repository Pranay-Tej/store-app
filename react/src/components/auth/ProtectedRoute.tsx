import { LOCAL_STORAGE_KEYS } from '@/constants/local-storage-keys.constants';
import { useAuthContext } from '@/context/auth.context';
import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// Guide:
// https://www.youtube.com/watch?v=2k8NleFjG7I
// https://medium.com/@dennisivy/creating-protected-routes-with-react-router-v6-2c4bbaf7bc1c

export function ProtectedRoute() {
  const { isAuthenticated, verifyUser } = useAuthContext();

  useEffect(() => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.API_TOKEN);
    if (token) {
      verifyUser(token);
    }
  }, []);

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate
      to={{
        pathname: '/accounts/login',
        search: `redirectUrl=${location.pathname}`
      }}
      // state={{
      //   from: location
      // }}
      replace
    />
  );
}
