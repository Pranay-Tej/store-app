import { useCartStore } from '@/store/cart.store';
import { Button } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

const Cart = () => {
  const { cart, increaseQuantity, decreaseQuantity, subTotal, removeFromCart } =
    useCartStore();
  return (
    <div>
      {cart.map(({ itemId, price, quantity, title, image }) => (
        <div key={itemId}>
          {title}
          {price}
          <Button
            variant="text"
            onClick={() => decreaseQuantity(itemId, price)}
          >
            -
          </Button>
          {quantity}
          <Button
            variant="text"
            onClick={() => increaseQuantity(itemId, price)}
          >
            +
          </Button>
          <Button
            variant="text"
            onClick={() => removeFromCart(itemId, price, quantity)}
          >
            X
          </Button>
        </div>
      ))}
      {subTotal()}
    </div>
  );
};

export default Cart;
