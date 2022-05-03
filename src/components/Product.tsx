import styles from '@/components/Product.module.css';
import { LOCAL_STORAGE_ITEM_IS_AUTHENTICATED } from '@/constants/app.constants';
import { useAuthContext } from '@/context/auth.context';
import { ProductModel } from '@/models/product.model';
import { useCartContext } from '@/context/cart.context';
import AddIcon from '@mui/icons-material/Add';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import RemoveIcon from '@mui/icons-material/Remove';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

const Product: React.FC<ProductModel> = ({
  id,
  title,
  price,
  description,
  category,
  image,
  rating
}) => {
  const history = useHistory();
  const { isAuthenticated } = useAuthContext();

  const { findById, cart, increaseQuantity, decreaseQuantity, addToCart } =
    useCartContext();

  const [cartQuantity, setCartQuantity] = useState<any>(null);

  useEffect(() => {
    setCartQuantity(findById(id)?.quantity);
    return () => {};
  }, [cart]);

  return (
    <div
      className={`${styles.product} grid min-h-full rounded-sm bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg`}
    >
      {/* <div
        className={`${styles.productImage}`}
        style={{ backgroundImage: `url(${image})` }}
      > */}
      <div className="flex justify-center">
        <img src={image} alt={title} className="h-full object-contain" />
      </div>
      <div className="grid gap-2 p-3">
        <Tooltip title={title}>
          <p className="overflow-hidden overflow-ellipsis whitespace-nowrap text-sm">
            {title}
          </p>
        </Tooltip>
        <p className="font-semibold text-gray-700">{price}</p>
        {isAuthenticated ? (
          cartQuantity > 0 ? (
            <div className="flex items-center justify-center gap-3">
              <IconButton
                aria-label="decrease"
                onClick={event => {
                  event.preventDefault();
                  decreaseQuantity(id);
                }}
              >
                <RemoveIcon />
              </IconButton>
              {cartQuantity}
              <IconButton
                aria-label="increase"
                onClick={event => {
                  event.preventDefault();
                  increaseQuantity(id);
                }}
              >
                <AddIcon />
              </IconButton>
            </div>
          ) : (
            <Button
              variant="text"
              endIcon={<LocalMallIcon />}
              onClick={event => {
                event.preventDefault();
                addToCart({ id, name: title, price, image, quantity: 1 });
              }}
            >
              Add to bag
            </Button>
          )
        ) : (
          <Button
            variant="text"
            onClick={event => {
              event.preventDefault();
              history.push('/accounts/login');
            }}
          >
            Login
          </Button>
        )}
      </div>
    </div>
  );
};

export default Product;
