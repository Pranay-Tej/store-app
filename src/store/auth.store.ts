import { LOCAL_STORAGE_ITEM_API_TOKEN } from '@/constants/app.constants';
import create from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  user: null | string;
  setUser: (user: string) => void;
}

export const useAuthStore = create<AuthState>(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      login: () => {
        set({ isAuthenticated: true });
        localStorage.setItem(LOCAL_STORAGE_ITEM_API_TOKEN, 'SECRET_TOKEN');
      },
      logout: () => {
        set({ isAuthenticated: false });
        localStorage.removeItem(LOCAL_STORAGE_ITEM_API_TOKEN);
      },
      user: null,
      setUser: (user: string) => {
        set({ user });
      }
    }),
    { name: 'auth-store' }
  )
);
