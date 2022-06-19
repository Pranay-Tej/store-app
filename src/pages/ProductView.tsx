import ProductRating from '@/components/ProductRating';
import { REACT_QUERY_KEYS } from '@/constants/react-query-keys.constants';
import { useAuthContext } from '@/context/auth.context';
import { useCartContext } from '@/context/cart.context';
import { useGraphqlClient } from '@/context/graphql-client.context';
import { GET_PRODUCT_BY_PK } from '@/graphql/products';
import { ActionIcon, Button, Loader } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useHistory, useParams } from 'react-router-dom';
import { Minus, Plus, ShoppingCartPlus } from 'tabler-icons-react';

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
    setCartQuantity(findById(id)?.quantity);
  }, [cart]);

  if (isLoading)
    return (
      <div className="grid min-h-screen place-items-center">
        <Loader variant="bars" />
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
                cartQuantity > 0 ? (
                  <div className="inline-flex items-center justify-center gap-3 rounded-sm border-2 border-gray-50">
                    <ActionIcon
                      aria-label="decrease"
                      onClick={() => {
                        decreaseQuantity(data.id);
                      }}
                    >
                      <Minus />
                    </ActionIcon>
                    <p className="text-lg font-semibold">{cartQuantity}</p>
                    <ActionIcon
                      aria-label="increase"
                      onClick={() => {
                        increaseQuantity(data.id);
                      }}
                    >
                      <Plus />
                    </ActionIcon>
                  </div>
                ) : (
                  <Button
                    leftIcon={<ShoppingCartPlus />}
                    onClick={() => {
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
                  onClick={() => {
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
