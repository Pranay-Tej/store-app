import { useAuthContext } from '@/context/auth.context';
import { Button } from '@mantine/core';
import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

interface LocationState {
  from: string;
}

const Login = () => {
  const { login, isAuthenticated } = useAuthContext();
  const history = useHistory();
  const { state } = useLocation<LocationState>();

  useEffect(() => {
    // on login() isAuthenticated is set to true;
    console.log({
      isAuthenticated
    });

    if (isAuthenticated) {
      history.push(state?.from ?? '/');
    }
  }, [isAuthenticated]);

  return (
    <div>
      <Button
        onClick={() => {
          login();
        }}
      >
        Login
      </Button>
    </div>
  );
};

export default Login;
