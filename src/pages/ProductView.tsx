import ManageCartItem from '@/components/ManageCartItem';
import { useAuthContext } from '@/context/auth.context';
import { useCartContext, useUserCartQuery } from '@/context/cart.context';
import { useGetProductByPkQuery } from '@/utils/__generated__/graphql';
import { Button, Loader } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ShoppingCartPlus } from 'tabler-icons-react';

const ProductView = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext();

  const { addToCart } = useCartContext();
  const { data: cart } = useUserCartQuery();
  const [cartQuantity, setCartQuantity] = useState<any>(null);

  const { id } = useParams<{ id: string }>();

  const {
    data: product,
    isLoading,
    error
  } = useGetProductByPkQuery(
    {
      id
    },
    {
      enabled: id !== undefined,
      select: res => res.products_by_pk
    }
  );

  useEffect(() => {
    setCartQuantity(cart?.find(item => item.product.id === id)?.quantity ?? 0);
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
                      addToCart(product.id);
                    }}
                    data-testid="add-to-bag"
                  >
                    Add to bag
                  </Button>
                )
              ) : (
                <Button
                  onClick={() => {
                    navigate('/accounts/login');
                  }}
                  data-testid="login-button"
                >
                  Login
                </Button>
              )}
            </div>
            <p className="mb-4 text-lg" data-testid="product-title">
              {product.title}
            </p>
            {/* <ProductRating
              rating={product?.rating?.rate}
              count={product?.rating?.count}
            /> */}
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
