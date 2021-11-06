import create from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  itemId: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
  // subTotal: number;
}
interface CartState {
  cart: CartItem[];
  findById: (id: number) => CartItem | undefined;
  setCart: (cart: []) => void;
  addToCart: (cart: CartItem) => void;
  removeFromCart: (itemId: number, price: number, quantity: number) => void;
  increaseQuantity: (itemId: number, price: number) => void;
  decreaseQuantity: (itemId: number, price: number) => void;
  subTotal: () => number;
  clearCart: () => void;
}

export const useCartStore = create<CartState>(
  persist(
    (set, get) => ({
      cart: [],
      subTotal: () => {
        return get()?.cart?.length === 0
          ? 0
          : get()?.cart?.reduce(
              (a, b) => a + Math.round(b.price * b.quantity * 100) / 100,
              0
            );
      },
      findById: (itemId: number) => {
        return get().cart.find(cartItem => cartItem.itemId === itemId);
      },
      setCart: (cart: []) => {
        set({ cart });
      },
      addToCart: (cartItem: CartItem) => {
        set({ cart: [...get().cart, cartItem] });
        // set({ subTotal: (get().subTotal += cartItem.price) });
      },
      removeFromCart: (itemId, price, quantity) => {
        set({
          cart: get().cart.filter(cartItem => cartItem.itemId !== itemId)
        });
        // set({ subTotal: (get().subTotal -= price * quantity) });
      },
      increaseQuantity: (itemId, price) => {
        set({
          cart: get().cart.map(cartItem =>
            cartItem.itemId === itemId
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          )
        });
        // set({ subTotal: (get().subTotal += price) });
      },
      decreaseQuantity: (itemId, price) => {
        set({
          cart: get().cart.map(cartItem =>
            cartItem.itemId === itemId
              ? { ...cartItem, quantity: cartItem.quantity - 1 }
              : cartItem
          )
        });
        // set({ subTotal: (get().subTotal -= price) });
        set({
          cart: get().cart.filter(cartItem => cartItem.quantity !== 0)
        });
      },
      clearCart: () => {
        set({ cart: [] });
      }
    }),
    { name: 'cart-store' }
  )
);
