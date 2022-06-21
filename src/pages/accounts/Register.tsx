import { NETLIFY_FUNCTIONS_BASE_URL } from '@/constants/app.constants';
import { REQUIRED_FIELD_MESSAGE } from '@/constants/validation.constants';
import { useAuthContext } from '@/context/auth.context';
import { Button, PasswordInput, TextInput } from '@mantine/core';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useHistory, useLocation } from 'react-router-dom';
import { Lock, User } from 'tabler-icons-react';

interface LocationState {
  from: string;
}

export interface RegisterForm {
  username: string;
  password: string;
}

const Register = () => {
  const { verifyUser, isAuthenticated } = useAuthContext();
  const history = useHistory();
  const { state } = useLocation<LocationState>();
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset: resetRegisterForm
  } = useForm<RegisterForm>({
    defaultValues: {
      username: '',
      password: ''
    }
  });

  useEffect(() => {
    // on register() isAuthenticated is set to true;
    console.log({
      isAuthenticated
    });

    if (isAuthenticated) {
      history.push(state?.from ?? '/');
    }
  }, [isAuthenticated]);

  const handleRegister = async (registerData: RegisterForm) => {
    try {
      setIsRegisterLoading(true);
      const { data } = await axios.post<{ jwt: string }>(
        `${NETLIFY_FUNCTIONS_BASE_URL}/signup`,
        registerData
      );
      verifyUser(data?.jwt);
    } catch (error: any) {
      setRegisterError(error?.response?.data?.message);
    } finally {
      setIsRegisterLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-lg my-5">Register</h1>
      <form
        onSubmit={handleSubmit(
          data => handleRegister(data),
          e => console.error(e)
        )}
      >
        <div className="grid gap-4">
          <Controller
            name="username"
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
                error={errors?.username?.message}
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
            disabled={isRegisterLoading}
            loading={isRegisterLoading}
            fullWidth
          >
            Register
          </Button>
        </div>
      </form>
      {registerError && (
        <p className="text-red-600 text-sm my-5">{registerError}</p>
      )}
    </div>
  );
};

export default Register;
