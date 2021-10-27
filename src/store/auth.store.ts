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
      },
      logout: () => {
        set({ isAuthenticated: false });
      },
      user: null,
      setUser: (user: string) => {
        set({ user });
      }
    }),
    { name: 'auth-store' }
  )
);
