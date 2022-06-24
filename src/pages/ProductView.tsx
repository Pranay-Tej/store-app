import ManageCartItem from '@/components/ManageCartItem';
import ProductRating from '@/components/ProductRating';
import { REACT_QUERY_KEYS } from '@/constants/react-query-keys.constants';
import { useAuthContext } from '@/context/auth.context';
import { useCartContext } from '@/context/cart.context';
import { GET_PRODUCT_BY_PK } from '@/graphql/products';
import { graphqlClient } from '@/utils/graphql-instance';
import { Button, Loader } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useHistory, useParams } from 'react-router-dom';
import { ShoppingCartPlus } from 'tabler-icons-react';

const ProductView = () => {
  const history = useHistory();
  const { isAuthenticated } = useAuthContext();

  const { cart, addToCart } = useCartContext();
  const [cartQuantity, setCartQuantity] = useState<any>(null);

  const { id } = useParams<{ id: string }>();

  const {
    data: product,
    isLoading,
    error
  } = useQuery(
    [REACT_QUERY_KEYS.GET_PRODUCT_BY_PK, id],
    async () => {
      const res = await graphqlClient.request(GET_PRODUCT_BY_PK, {
        id
      });
      return res?.products_by_pk;
    },
    {
      enabled: id !== undefined
    }
  );

  useEffect(() => {
    setCartQuantity(cart.find(item => item.product.id === id)?.quantity ?? 0);
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
    <div className="px-50 mx-auto my-5 min-h-full max-w-7xl bg-white py-10">
      {product && (
        <div className="p-3 lg:grid lg:grid-cols-2 lg:items-center lg:gap-6">
          <div className="flex h-96 w-full justify-center">
            <img
              loading="lazy"
              className="h-full object-cover"
              src={product.image}
              alt={product.title}
            />
          </div>
          <div className="pt-4">
            <div className="my-4 ">
              {isAuthenticated ? (
                cartQuantity > 0 ? (
                  <ManageCartItem
                    productId={product.id}
                    quantity={cartQuantity}
                  />
                ) : (
                  <Button
                    leftIcon={<ShoppingCartPlus strokeWidth={1.5} />}
                    onClick={() => {
                      addToCart.mutate(product.id);
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
            <p className="mb-4 text-lg">{product.title}</p>
            <ProductRating
              rating={product?.rating?.rate}
              count={product?.rating?.count}
            />
            <p className="mb-2 text-xl font-semibold text-gray-700">
              &#8377; {product.price}
            </p>
            <p className="max-w-md text-base text-gray-600">
              {product.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductView;
