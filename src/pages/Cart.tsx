import { useCartStore } from '@/store/cart.store';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import RemoveIcon from '@mui/icons-material/Remove';
import IconButton from '@mui/material/IconButton';

const Cart = () => {
  const { cart, increaseQuantity, decreaseQuantity, subTotal, removeFromCart } =
    useCartStore();
  return (
    <div>
      {cart.map(({ itemId, price, quantity, title, image }) => (
        <div key={itemId}>
          {title}
          {price}
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
          <IconButton
            color="error"
            aria-label="remove"
            onClick={() => removeFromCart(itemId, price, quantity)}
          >
            <CloseIcon />
          </IconButton>
        </div>
      ))}
      {subTotal()}
    </div>
  );
};

export default Cart;
