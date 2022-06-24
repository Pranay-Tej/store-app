import ManageCartItem from '@/components/ManageCartItem';
import { useAxiosInstance } from '@/context/axios.context';
import { useCartContext } from '@/context/cart.context';
import { ActionIcon, Button } from '@mantine/core';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Trash } from 'tabler-icons-react';
import styles from './Cart.module.css';

const Cart = () => {
  const { axiosInstance, protectedAxiosInstance } = useAxiosInstance();

  const { cart, subTotal, removeFromCart, fetchUserCart } = useCartContext();

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
    <div className="mx-auto my-5 min-h-full max-w-7xl bg-white px-5 py-10 lg:px-10">
      {cart.map(({ product: { id, price, image, title }, quantity }) => (
        <div
          key={id}
          className={`mb-8 grid items-center border-b-2 border-gray-100 pb-4 ${styles.cartGrid}`}
        >
          <div className="h-36 overflow-hidden">
            <Link to={`/product/${id}`}>
              <img
                loading="lazy"
                className="h-auto min-w-full object-cover"
                src={image}
                alt={title}
              />
            </Link>
          </div>
          <div>
            <div className="mb-5 flex items-center gap-5">
              <Link to={`/product/${id}`}>{title}</Link>
              <ActionIcon
                size="lg"
                color="error"
                aria-label="remove"
                onClick={() => removeFromCart.mutate(id)}
                className="text-red-400"
              >
                <Trash strokeWidth={1.5} />
              </ActionIcon>
            </div>
            <div className="mb-5 flex items-center gap-5">
              <span className="font-semibold text-gray-500">
                &#8377; {price}
              </span>
              <ManageCartItem productId={id} quantity={quantity} />
            </div>
            <p className="font-semibold text-gray-800">
              &#8377; {Math.round(price * quantity * 100) / 100}
            </p>
          </div>
        </div>
      ))}
      <div className="mt-10 text-lg text-gray-700">
        Total Amount:
        <span className="pl-5 text-xl font-semibold">&#8377; {subTotal}</span>
      </div>
    </div>
  );
};

export default Cart;
