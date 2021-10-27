import create from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  cart: [];
  setCart: (cart: []) => void;
}

export const useAuthStore = create<AuthState>(
  persist(
    (set, get) => ({
      cart: [],
      setCart: (cart: []) => {
        set({ cart });
      }
    }),
    { name: 'cart-store' }
  )
);
