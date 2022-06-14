import ProductRating from '@/components/ProductRating';
import { FAKE_STORE_API_BASE_URL } from '@/constants/app.constants';
import { useAuthContext } from '@/context/auth.context';
import useAxiosGet from '@/hooks/useAxiosGet';
import { ProductModel } from '@/models/product.model';
import { useCartContext } from '@/context/cart.context';
import AddIcon from '@mui/icons-material/Add';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import RemoveIcon from '@mui/icons-material/Remove';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useHistory } from 'react-router-dom';

const ProductView = () => {
  const history = useHistory();
  const { isAuthenticated } = useAuthContext();

  const { findById, cart, addToCart, increaseQuantity, decreaseQuantity } =
    useCartContext();
  const [cartQuantity, setCartQuantity] = useState<any>(null);

  const { id } = useParams<{ id: string }>();

  const { fetchData, isLoading, data, errorMessage } =
    useAxiosGet<ProductModel>();

  useEffect(() => {
    fetchData({ url: `${FAKE_STORE_API_BASE_URL}/products/${id}` });
    return () => {};
  }, []);

  useEffect(() => {
    setCartQuantity(findById(Number(id))?.quantity);
  }, [cart]);

  if (isLoading)
    return (
      <div className="grid min-h-screen place-items-center">
        <CircularProgress />
      </div>
    );

  if (errorMessage)
    return (
      <div className="grid min-h-screen place-items-center">{errorMessage}</div>
    );

  return (
    <div className="mx-auto min-h-full max-w-5xl bg-white px-3 pt-10">
      {data && (
        <div className="p-3 lg:grid lg:grid-cols-2 lg:items-center lg:gap-6">
          <div className="h-96 w-full">
            <img
              className="mx-auto h-full object-contain"
              src={data.image}
              alt={data.title}
            />
          </div>
          <div className="pt-4">
            <div className="my-4 ">
              {isAuthenticated ? (
                cartQuantity ? (
                  <div className="inline-flex items-center justify-center gap-3 rounded-sm border-2 border-gray-50">
                    <IconButton
                      aria-label="decrease"
                      onClick={event => {
                        event.preventDefault();
                        decreaseQuantity(data.id);
                      }}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <p className="text-lg font-semibold">{cartQuantity}</p>
                    <IconButton
                      aria-label="increase"
                      onClick={event => {
                        increaseQuantity(data.id);
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </div>
                ) : (
                  <Button
                    size="large"
                    variant="contained"
                    endIcon={<LocalMallIcon />}
                    onClick={event => {
                      addToCart({
                        id: data.id,
                        name: data.title,
                        price: data.price,
                        image: data.image,
                        quantity: 1
                      });
                    }}
                  >
                    Add to bag
                  </Button>
                )
              ) : (
                <Button
                  variant="text"
                  onClick={event => {
                    history.push('/accounts/login');
                  }}
                >
                  Login
                </Button>
              )}
            </div>
            <p className="mb-4 text-lg">{data.title}</p>
            <ProductRating
              rating={data?.rating?.rate}
              count={data?.rating?.count}
            />
            <p className="mb-2 text-xl font-semibold text-gray-700">
              {data.price}
            </p>
            <p className="max-w-md text-base text-gray-600">
              {data.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductView;
