import { LOCAL_STORAGE_ITEM_API_TOKEN } from '@/constants/app.constants';
import { useAxiosInstance } from '@/context/axios.context';
import { User } from '@/models/user.model';
import { useState } from 'react';

export function useUser() {
  const { axiosInstance } = useAxiosInstance();
  const [user, setUser] = useState<User | null>(null);

  const login = () => {
    // return axiosInstance
    //   .post('/accounts/login', {
    //     email: ''
    //   })
    //   .then(response => {
    //     // const user = response.data;
    //     setUser({ username: 'test007' });
    //   });
    setUser({ username: 'test007' });
    localStorage.setItem(LOCAL_STORAGE_ITEM_API_TOKEN, 'SECRET_TOKEN');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_ITEM_API_TOKEN);
  };

  return {
    user,
    login,
    logout
  };
}
