import {
  FAKE_STORE_API_BASE_URL,
  LOCAL_STORAGE_ITEM_API_TOKEN,
  LOCAL_STORAGE_ITEM_IS_AUTHENTICATED
} from '@/constants/app.constants';
import { axiosInstance } from '@/utils/axios-instance';
import create from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  token: null | string;
  setToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      login: async () => {
        try {
          const res = await axiosInstance.post<{ token: string }>(
            `${FAKE_STORE_API_BASE_URL}/auth/login`,
            {
              username: 'mor_2314',
              password: '83r5^_'
            }
          );
          set({ isAuthenticated: true, token: res.data.token });
          localStorage.setItem(LOCAL_STORAGE_ITEM_API_TOKEN, res.data.token);
          localStorage.setItem(LOCAL_STORAGE_ITEM_IS_AUTHENTICATED, 'true');
        } catch (error) {
          console.error(error);
        }
      },
      logout: () => {
        set({ isAuthenticated: false, token: null });
        localStorage.removeItem(LOCAL_STORAGE_ITEM_API_TOKEN);
        localStorage.setItem(LOCAL_STORAGE_ITEM_IS_AUTHENTICATED, 'false');
      },
      token: null,
      setToken: (token: string) => {
        set({ token });
      }
    }),
    { name: 'auth-store' }
  )
);
