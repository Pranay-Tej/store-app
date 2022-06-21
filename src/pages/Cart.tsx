import { useAxiosInstance } from '@/context/axios.context';
import { useCartContext } from '@/context/cart.context';
import { ActionIcon, Button } from '@mantine/core';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, ShoppingCart, Trash } from 'tabler-icons-react';
import styles from './Cart.module.css';

const Cart = () => {
  const { axiosInstance, protectedAxiosInstance } = useAxiosInstance();

  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    subTotal,
    removeFromCart,
    fetchUserCart
  } = useCartContext();

  // to test protectedAxiosInstance
  // this will always respond with 401 error
  // useEffect((): void => {
  //   protectedAxiosInstance
  //     .post(`${FAKE_STORE_API_BASE_URL}/auth/login`, {
  //       username: 'wrong',
  //       password: 'wrong'
  //     })
  //     .then(res => {
  //       console.log(res.data);
  //     });
  // }, []);

  useEffect(() => {
    fetchUserCart();
  }, []);

  if (cart.length === 0) {
    return (
      <div className="mx-auto mt-20 grid max-w-md justify-items-center gap-5">
        <p className="text-2xl">Your cart is empty</p>
        <Link to="/">
          <Button leftIcon={<ShoppingCart />}>Shop now!</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-full max-w-7xl bg-white px-10 pt-10">
      {cart.map(({ product: { id, price, image, title }, quantity }) => (
        <div
          key={id}
          className={`mb-8 grid items-center border-b-2 border-gray-100 pb-4 ${styles.cartGrid}`}
        >
          <div className="h-32 w-full">
            <Link to={`/product/${id}`}>
              <img
                loading="lazy"
                className="h-full object-contain"
                src={image}
                alt={title}
              />
            </Link>
          </div>
          <div className="grid gap-4">
            <p>
              <Link to={`/product/${id}`}>{title}</Link>
              <span className="mx-4 font-semibold text-gray-500">{price}</span>
              <ActionIcon
                size="lg"
                color="error"
                aria-label="remove"
                onClick={() => removeFromCart.mutate(id)}
              >
                <Trash strokeWidth={1.5} />
              </ActionIcon>
            </p>

            <div className="inline-flex items-center gap-3 justify-self-start rounded-sm border-2 border-gray-50">
              <ActionIcon
                size="lg"
                aria-label="decrease"
                onClick={() => {
                  if (quantity > 1) {
                    decreaseQuantity({
                      product_id: id,
                      quantity
                    });
                  } else {
                    removeFromCart.mutate(id);
                  }
                }}
              >
                <Minus strokeWidth={1.5} />
              </ActionIcon>
              {quantity}
              <ActionIcon
                size="lg"
                aria-label="increase"
                onClick={() => increaseQuantity({ product_id: id, quantity })}
              >
                <Plus strokeWidth={1.5} />
              </ActionIcon>
            </div>
            <p className="font-semibold text-gray-800">
              {Math.round(price * quantity * 100) / 100}
            </p>
          </div>
        </div>
      ))}
      <div className="mt-10 text-lg text-gray-700">
        Total Amount:
        <span className="pl-5 text-xl font-semibold">{subTotal}</span>
      </div>
    </div>
  );
};

export default Cart;
