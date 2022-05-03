import React, { createContext, useMemo } from 'react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface ICartContext {
  cart: CartItem[];
  findById(id: number): CartItem | undefined;
  subTotal: number;
  addToCart: (item: CartItem) => void;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<ICartContext>({
  cart: [],
  findById: () => undefined,
  subTotal: 0,
  addToCart: () => {},
  increaseQuantity: () => {},
  decreaseQuantity: () => {},
  removeFromCart: () => {},
  clearCart: () => {}
});

export const CartProvider: React.FC<React.ReactNode> = ({ children }) => {
  const [cart, setCart] = React.useState<CartItem[]>([]);

  const subTotal = useMemo(() => {
    return cart.reduce((acc, curr) => {
      return acc + curr.price * curr.quantity;
    }, 0);
  }, [cart]);

  const findById = (id: number) => {
    return cart.find(item => item.id === id);
  };

  const addToCart = (item: CartItem) => {
    const { id, name, price, image } = item;
    setCart([...cart, { id, name, price, quantity: 1, image }]);
  };

  const increaseQuantity = (id: number) => {
    setCart(
      cart.map(cartItem =>
        cartItem.id === id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      )
    );
  };

  const decreaseQuantity = (id: number) => {
    setCart(prev =>
      prev.map(cartItem =>
        cartItem.id === id
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      )
    );
    setCart(prev => prev.filter(cartItem => cartItem.quantity !== 0));
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(cartItem => cartItem.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        findById,
        subTotal,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  return React.useContext(CartContext);
};
