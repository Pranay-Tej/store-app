import { SHIRUDO_APP_ID, SHIRUDO_BASE_URL } from '@/constants/app.constants';
import { REQUIRED_FIELD_MESSAGE } from '@/constants/validation.constants';
import { useAuthContext } from '@/context/auth.context';
import { useUrlQuery } from '@/hooks/useUrlQuery';
import { Button, PasswordInput, TextInput } from '@mantine/core';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { redirect, useLocation, useNavigate } from 'react-router-dom';
import { Lock, User } from 'tabler-icons-react';

export interface LoginForm {
  identity: string;
  password: string;
}

const Login = () => {
  const { verifyUser, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const urlQuery = useUrlQuery();
  // const { state } = useLocation();
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
      identity: 'user001',
      password: 'user001'
    }
  });

  useEffect(() => {
    // on login() isAuthenticated is set to true;
    console.log({
      isAuthenticated
    });

    if (isAuthenticated) {
      navigate(urlQuery.get('redirectUrl') ?? '/', {
        replace: true
      });
      // navigate(state?.from ?? '/');

      // console.log(urlQuery.get('redirectUrl'));
      // redirect(urlQuery.get('redirectUrl') ?? '/');
      // navigate(urlQuery.get('redirectUrl') ?? '/', {
      //   replace: true,
      //   relative: 'route',

      // });
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
      verifyUser(data?.jwt);
    } catch (error: any) {
      setLoginError(error?.response?.data?.message);
    } finally {
      setIsLoginLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-20 max-w-md rounded-sm border-t-4 border-solid border-blue-500 bg-white p-5 py-8">
      <h1 className="mb-5 text-lg">Login</h1>
      <form
        data-testid="login-form"
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
                size="md"
                label="Username or Email"
                error={errors?.identity?.message}
                icon={<User size={18} />}
                data-testid="identity"
                id="identity"
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
                size="md"
                label="Password"
                error={errors?.password?.message}
                icon={<Lock size={18} />}
                data-testid="password"
                id="password"
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
      {loginError && <p className="my-5 text-sm text-red-600">{loginError}</p>}
    </div>
  );
};

export default Login;
