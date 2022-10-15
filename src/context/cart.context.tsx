import { REACT_QUERY_KEYS } from '@/constants/react-query-keys.constants';
import { queryClient } from '@/utils/react-query-client';
import {
  useCartItemsQuery,
  useClearCartMutation,
  useDeleteCartItemMutation,
  useInsertCartItemsOneMutation,
  useUpdateCartItemMutation
} from '@/utils/__generated__/graphql';
import React, { createContext, useMemo } from 'react';
import { useAuthContext } from './auth.context';

interface ICartContext {
  addToCart: (product_id: string) => void;
  increaseQuantity: (product_id: string, quantity: number) => void;
  decreaseQuantity: (product_id: string, quantity: number) => void;
  removeFromCart: (product_id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext({} as ICartContext);

export const CartProvider: React.FC<React.ReactNode> = ({ children }) => {
  const { userId } = useAuthContext();

  const addToCartMutation = useInsertCartItemsOneMutation({
    onSuccess: () => {
      queryClient.invalidateQueries([REACT_QUERY_KEYS.GET_USER_CART_ITEMS]);
    }
  });

  const addToCart = (product_id: string) => {
    addToCartMutation.mutate({ product_id, quantity: 1 });
  };

  const updateCartQuantity = useUpdateCartItemMutation({
    onSuccess: () => {
      queryClient.invalidateQueries([REACT_QUERY_KEYS.GET_USER_CART_ITEMS]);
    }
  });

  const increaseQuantity = (product_id: string, quantity: number) => {
    updateCartQuantity.mutate({
      customer_id: userId,
      product_id,
      quantity: quantity + 1
    });
  };

  const decreaseQuantity = (product_id: string, quantity: number) => {
    updateCartQuantity.mutate({
      customer_id: userId,
      product_id,
      quantity: quantity - 1
    });
  };

  const deleteCartMutation = useDeleteCartItemMutation({
    onSuccess: () => {
      queryClient.invalidateQueries([REACT_QUERY_KEYS.GET_USER_CART_ITEMS]);
    }
  });

  const removeFromCart = (product_id: string) => {
    deleteCartMutation.mutate({
      customer_id: userId,
      product_id
    });
  };

  const clearCartMutation = useClearCartMutation({
    onSuccess: () => {
      queryClient.invalidateQueries([REACT_QUERY_KEYS.GET_USER_CART_ITEMS]);
    },
    onError: err => {
      console.error(err);
    }
  });

  const clearCart = () => {
    clearCartMutation.mutate({
      customer_id: userId
    });
  };

  return (
    <CartContext.Provider
      value={{
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

export const useUserCartQuery = () => {
  const { userId } = useAuthContext();

  return useCartItemsQuery(
    {
      customer_id: userId
    },
    {
      enabled: userId !== undefined,
      select: res => res.cart_items
    }
  );
};
