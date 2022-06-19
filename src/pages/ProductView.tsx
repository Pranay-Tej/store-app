import ProductRating from '@/components/ProductRating';
import { REACT_QUERY_KEYS } from '@/constants/react-query-keys.constants';
import { useAuthContext } from '@/context/auth.context';
import { useCartContext } from '@/context/cart.context';
import { useGraphqlClient } from '@/context/graphql-client.context';
import { GET_PRODUCT_BY_PK } from '@/graphql/products';
import AddIcon from '@mui/icons-material/Add';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import RemoveIcon from '@mui/icons-material/Remove';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useHistory, useParams } from 'react-router-dom';

const ProductView = () => {
  const history = useHistory();
  const { isAuthenticated } = useAuthContext();

  const { findById, cart, addToCart, increaseQuantity, decreaseQuantity } =
    useCartContext();
  const [cartQuantity, setCartQuantity] = useState<any>(null);

  const { id } = useParams<{ id: string }>();

  const { graphQlClient } = useGraphqlClient();

  const {
    data: data,
    isLoading,
    error
  } = useQuery(
    [REACT_QUERY_KEYS.GET_PRODUCT_BY_PK, id],
    async () => {
      const res = await graphQlClient.request(GET_PRODUCT_BY_PK, {
        id
      });
      return res?.products_by_pk;
    },
    {
      enabled: id !== undefined
    }
  );

  useEffect(() => {
    setCartQuantity(findById(Number(id))?.quantity);
  }, [cart]);

  if (isLoading)
    return (
      <div className="grid min-h-screen place-items-center">
        <CircularProgress />
      </div>
    );

  if (error)
    return (
      <div className="grid min-h-screen place-items-center">
        {JSON.stringify(error)}
      </div>
    );

  return (
    <div className="mx-auto min-h-full max-w-5xl bg-white px-3 pt-10">
      {data && (
        <div className="p-3 lg:grid lg:grid-cols-2 lg:items-center lg:gap-6">
          <div className="h-96 w-full">
            <img
              loading="lazy"
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
