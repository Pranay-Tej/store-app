import { REACT_QUERY_KEYS } from '@/constants/react-query-keys.constants';
import {
  CLEAR_CART,
  DELETE_CART_ITEM,
  GET_CART_ITEMS,
  INSERT_CART_ITEMS_ONE,
  UPDATE_CART_ITEM
} from '@/graphql/carts';
import { createProtectedGraphQlClient } from '@/utils/graphql-instance';
import React, { createContext, useEffect, useMemo } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useAuthContext } from './auth.context';

// interface CartItem {
//   id: string;
//   name: string;
//   price: number;
//   quantity: number;
//   image: string;
// }

interface ICartContext {
  fetchUserCart: () => void;
  cart: any[];
  subTotal: number;
  addToCart: any;
  increaseQuantity: any;
  decreaseQuantity: any;
  removeFromCart: any;
  clearCart: any;
}

const CartContext = createContext({} as ICartContext);

export const CartProvider: React.FC<React.ReactNode> = ({ children }) => {
  const [cart, setCart] = React.useState<any[]>([]);

  const { userId } = useAuthContext();

  const { refetch: fetchUserCart } = useQuery(
    REACT_QUERY_KEYS.GET_USER_CART_ITEMS,
    async () => {
      const res = await createProtectedGraphQlClient().request(GET_CART_ITEMS, {
        customer_id: userId
      });
      return res?.cart_items;
    },
    {
      enabled: false,
      onSuccess: data => {
        setCart(data);
      },
      onError: err => {
        console.error(err);
      }
    }
  );

  useEffect(() => {
    if (userId) {
      fetchUserCart();
    }
  }, [userId]);

  const subTotal = useMemo(() => {
    return cart.reduce((acc, curr) => {
      return acc + curr?.product?.price * curr?.quantity;
    }, 0);
  }, [cart]);

  const addToCart = useMutation(
    async (product_id: string) => {
      const res = await createProtectedGraphQlClient().request(
        INSERT_CART_ITEMS_ONE,
        {
          product_id,
          quantity: 1
        }
      );
      return res?.insert_cart_items_one;
    },
    {
      onSuccess: () => {
        // queryClient.invalidateQueries(REACT_QUERY_KEYS.GET_USER_CART_ITEMS);
        fetchUserCart();
      },
      onError: err => {
        console.error(err);
      }
    }
  );

  const updateCartQuantity = useMutation<any, any, any>(
    async ({ product_id, quantity }) => {
      const res = await createProtectedGraphQlClient().request(
        UPDATE_CART_ITEM,
        {
          product_id,
          quantity,
          customer_id: userId
        }
      );
      return res?.update_cart_items;
    },
    {
      onSuccess: () => {
        // queryClient.invalidateQueries(REACT_QUERY_KEYS.GET_USER_CART_ITEMS);
        fetchUserCart();
      },
      onError: err => {
        console.error(err);
      }
    }
  );

  const increaseQuantity = ({
    product_id,
    quantity
  }: {
    product_id: string;
    quantity: number;
  }) => {
    updateCartQuantity.mutate({ product_id, quantity: quantity + 1 });
  };

  const decreaseQuantity = ({
    product_id,
    quantity
  }: {
    product_id: string;
    quantity: number;
  }) => {
    updateCartQuantity.mutate({ product_id, quantity: quantity - 1 });
  };

  const removeFromCart = useMutation(
    async product_id => {
      const res = await createProtectedGraphQlClient().request(
        DELETE_CART_ITEM,
        {
          product_id,
          customer_id: userId
        }
      );
      return res?.delete_cart_items;
    },
    {
      onSuccess: () => {
        // queryClient.invalidateQueries(REACT_QUERY_KEYS.GET_USER_CART_ITEMS);
        fetchUserCart();
      },
      onError: err => {
        console.error(err);
      }
    }
  );

  const clearCart = useMutation(
    async () => {
      const res = await createProtectedGraphQlClient().request(CLEAR_CART, {
        customer_id: userId
      });
      return res?.delete_cart_items;
    },
    {
      onSuccess: () => {
        // queryClient.invalidateQueries(REACT_QUERY_KEYS.GET_USER_CART_ITEMS);
        fetchUserCart();
      },
      onError: err => {
        console.error(err);
      }
    }
  );

  return (
    <CartContext.Provider
      value={{
        fetchUserCart,
        cart,
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
