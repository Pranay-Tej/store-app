import {
  LOCAL_STORAGE_ITEM_API_TOKEN,
  LOCAL_STORAGE_ITEM_IS_AUTHENTICATED
} from '@/constants/app.constants';
import { useAuthStore } from '@/store/auth.store';
import Button from '@mui/material/Button';
import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

interface LocationState {
  from: string;
}

const Login = () => {
  const login = useAuthStore(state => state.login);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const history = useHistory();
  const { state } = useLocation<LocationState>();

  useEffect(() => {
    // on login() isAuthenticated is set to true;
    if (
      isAuthenticated &&
      localStorage.getItem(LOCAL_STORAGE_ITEM_IS_AUTHENTICATED) === 'true' &&
      localStorage.getItem(LOCAL_STORAGE_ITEM_API_TOKEN)
    ) {
      history.push(state?.from ?? '/');
    }
  }, [isAuthenticated]);

  return (
    <div>
      <Button variant="contained" onClick={() => login()}>
        Login
      </Button>
    </div>
  );
};

export default Login;
