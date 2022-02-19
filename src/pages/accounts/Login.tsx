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
    // onUserFound();
    if (isAuthenticated) {
      history.push(state?.from || '/');
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
