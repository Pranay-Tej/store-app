import styles from '@/components/Product.module.css';
import { ProductModel } from '@/models/product.model';
import { useCartStore } from '@/store/cart.store';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import React, { useEffect, useState } from 'react';

const Product: React.FC<ProductModel> = ({
  id,
  title,
  price,
  description,
  category,
  image,
  rating
}) => {
  const { findById, cart, addToCart, increaseQuantity, decreaseQuantity } =
    useCartStore();
  const [cartQuantity, setCartQuantity] = useState<any>(null);

  useEffect(() => {
    setCartQuantity(findById(id)?.quantity);
    return () => {};
  }, [cart]);

  return (
    <div
      className={`${styles.product} grid min-h-full transition-shadow duration-300 rounded-sm shadow-sm hover:shadow-lg bg-white`}
    >
      {/* <div
        className={`${styles.productImage}`}
        style={{ backgroundImage: `url(${image})` }}
      > */}
      <div className="flex justify-center">
        <img src={image} alt={title} className="object-contain h-full" />
      </div>
      <div className={`${styles.productInfo} p-3 grid gap-2`}>
        <Tooltip title={title}>
          <p className="overflow-hidden text-sm whitespace-nowrap overflow-ellipsis">
            {title}
          </p>
        </Tooltip>
        <p className="font-semibold text-gray-700">{price}</p>
        {cartQuantity ? (
          <div className="flex items-center justify-center gap-3">
            <IconButton
              aria-label="decrease"
              onClick={event => {
                event.preventDefault();
                decreaseQuantity(id, price);
              }}
            >
              <RemoveIcon />
            </IconButton>
            {cartQuantity}
            <IconButton
              aria-label="increase"
              onClick={event => {
                event.preventDefault();
                increaseQuantity(id, price);
              }}
            >
              <AddIcon />
            </IconButton>
          </div>
        ) : (
          <Button
            variant="text"
            endIcon={<ShoppingCartIcon />}
            onClick={event => {
              event.preventDefault();
              addToCart({ itemId: id, title, price, image, quantity: 1 });
            }}
          >
            Add to Cart
          </Button>
        )}
      </div>
    </div>
  );
};

export default Product;
