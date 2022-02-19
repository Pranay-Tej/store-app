import { useUser } from '@/hooks/useUser';
import { useAuthStore } from '@/store/auth.store';
import { Redirect, Route } from 'react-router-dom';

export function ProtectedRoute({ children, ...rest }: any) {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

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
