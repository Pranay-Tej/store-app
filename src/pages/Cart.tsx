import { useCartStore } from '@/store/cart.store';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import RemoveIcon from '@mui/icons-material/Remove';
import IconButton from '@mui/material/IconButton';
import styles from './Cart.module.css';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import { useEffect } from 'react';
import { protectedAxiosInstance } from '@/utils/axios-protected-instance';
import { FAKE_STORE_API_BASE_URL } from '@/constants/app.constants';

const Cart = () => {
  const { cart, increaseQuantity, decreaseQuantity, subTotal, removeFromCart } =
    useCartStore();

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

  if (cart.length === 0) {
    return (
      <div className="mx-auto mt-20 grid max-w-md justify-items-center gap-5">
        <p className="text-2xl">Your cart is empty</p>
        <Link to="/">
          <Button variant="contained" endIcon={<LocalMallIcon />}>
            Shop now!
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-full max-w-5xl bg-white px-10 pt-10">
      {cart.map(({ itemId, price, quantity, title, image }) => (
        <div
          key={itemId}
          className={`mb-8 grid items-center border-b-2 border-gray-100 pb-4 ${styles.cartGrid}`}
        >
          <div className="h-32 w-full">
            <Link to={`/product/${itemId}`}>
              <img className="h-full object-contain" src={image} alt={title} />
            </Link>
          </div>
          <div className="grid gap-4">
            <p>
              <Link to={`/product/${itemId}`}>{title}</Link>
              <span className="mx-4 font-semibold text-gray-500">{price}</span>
              <IconButton
                color="error"
                aria-label="remove"
                onClick={() => removeFromCart(itemId, price, quantity)}
              >
                <CloseIcon />
              </IconButton>
            </p>

            <div className="inline-flex items-center gap-3 justify-self-start rounded-sm border-2 border-gray-50">
              <IconButton
                aria-label="decrease"
                onClick={() => decreaseQuantity(itemId, price)}
              >
                <RemoveIcon />
              </IconButton>
              {quantity}
              <IconButton
                aria-label="increase"
                onClick={() => increaseQuantity(itemId, price)}
              >
                <AddIcon />
              </IconButton>
            </div>
            <p className="font-semibold text-gray-800">
              {Math.round(price * quantity * 100) / 100}
            </p>
          </div>
        </div>
      ))}
      <div className="mt-10 text-lg text-gray-700">
        Total Amount:
        <span className="pl-5 text-xl font-semibold">{subTotal()}</span>
      </div>
    </div>
  );
};

export default Cart;
