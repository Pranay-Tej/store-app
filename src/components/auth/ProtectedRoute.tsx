import { useAuthContext } from '@/context/auth.context';
import { Redirect, Route } from 'react-router-dom';

export function ProtectedRoute({ children, ...rest }: any) {
  const { isAuthenticated } = useAuthContext();

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
