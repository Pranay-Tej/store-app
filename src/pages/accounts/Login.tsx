import { SHIRUDO_APP_ID, SHIRUDO_BASE_URL } from '@/constants/app.constants';
import { REQUIRED_FIELD_MESSAGE } from '@/constants/validation.constants';
import { useAuthContext } from '@/context/auth.context';
import { Button, TextInput, PasswordInput } from '@mantine/core';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useHistory, useLocation } from 'react-router-dom';
import { Lock } from 'tabler-icons-react';
import { User } from 'tabler-icons-react';

interface LocationState {
  from: string;
}

export interface LoginForm {
  identity: string;
  password: string;
}

const Login = () => {
  const { setAuthState, isAuthenticated } = useAuthContext();
  const history = useHistory();
  const { state } = useLocation<LocationState>();
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset: resetLoginForm
  } = useForm<LoginForm>({
    defaultValues: {
      identity: '',
      password: ''
    }
  });

  useEffect(() => {
    // on login() isAuthenticated is set to true;
    console.log({
      isAuthenticated
    });

    if (isAuthenticated) {
      history.push(state?.from ?? '/');
    }
  }, [isAuthenticated]);

  const handleLogin = async (loginData: LoginForm) => {
    try {
      setIsLoginLoading(true);
      const { data } = await axios.post<{ jwt: string }>(
        `${SHIRUDO_BASE_URL}/users/login`,
        {
          ...loginData,
          app_id: SHIRUDO_APP_ID
        }
      );
      setAuthState(data?.jwt);
      resetLoginForm();
    } catch (error: any) {
      setLoginError(error?.response?.data?.message);
    } finally {
      setIsLoginLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-lg my-5">Login</h1>
      <form
        onSubmit={handleSubmit(
          data => handleLogin(data),
          e => console.error(e)
        )}
      >
        <div className="grid gap-4">
          <Controller
            name="identity"
            control={control}
            rules={{
              required: {
                value: true,
                message: REQUIRED_FIELD_MESSAGE
              }
            }}
            render={({ field }) => (
              <TextInput
                {...field}
                label="Username or Email"
                error={errors?.identity?.message}
                icon={<User size={16} />}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            rules={{
              required: {
                value: true,
                message: REQUIRED_FIELD_MESSAGE
              }
            }}
            render={({ field }) => (
              <PasswordInput
                {...field}
                label="Password"
                error={errors?.password?.message}
                icon={<Lock size={16} />}
              />
            )}
          />
          <Button
            type="submit"
            disabled={isLoginLoading}
            loading={isLoginLoading}
            fullWidth
          >
            Login
          </Button>
        </div>
      </form>
      {loginError && <p className="text-red-600 text-sm my-5">{loginError}</p>}
    </div>
  );
};

export default Login;
