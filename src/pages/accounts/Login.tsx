import {
  LOCAL_STORAGE_ITEM_API_TOKEN,
  LOCAL_STORAGE_ITEM_IS_AUTHENTICATED
} from '@/constants/app.constants';
import { useAuthContext } from '@/context/auth.context';
import Button from '@mui/material/Button';
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
        variant="contained"
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
