import { useCartStore } from '@/store/cart.store';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import RemoveIcon from '@mui/icons-material/Remove';
import IconButton from '@mui/material/IconButton';
import styles from './Cart.module.css';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import LocalMallIcon from '@mui/icons-material/LocalMall';

const Cart = () => {
  const { cart, increaseQuantity, decreaseQuantity, subTotal, removeFromCart } =
    useCartStore();

  if (cart.length === 0) {
    return (
      <div className="grid max-w-md gap-5 mx-auto mt-20 justify-items-center">
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
    <div className="max-w-5xl min-h-full px-10 pt-10 mx-auto bg-white">
      {cart.map(({ itemId, price, quantity, title, image }) => (
        <div
          key={itemId}
          className={`grid items-center mb-8 pb-4 border-b-2 border-gray-100 ${styles.cartGrid}`}
        >
          <div className="w-full h-32">
            <Link to={`/product/${itemId}`}>
              <img className="object-contain h-full" src={image} alt={title} />
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

            <div className="inline-flex items-center gap-3 border-2 rounded-sm border-gray-50 justify-self-start">
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
