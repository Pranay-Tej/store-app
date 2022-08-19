import ManageCartItem from '@/components/ManageCartItem';
import { NETLIFY_FUNCTIONS_BASE_URL } from '@/constants/app.constants';
import { REACT_QUERY_KEYS } from '@/constants/react-query-keys.constants';
import { useAuthContext } from '@/context/auth.context';
import { useAxiosInstance } from '@/context/axios.context';
import { useCartContext } from '@/context/cart.context';
import { GET_ADDRESSES } from '@/graphql/addresses';
import useToggle from '@/hooks/useToggle';
import { Address } from '@/models/address.model';
import { createProtectedGraphQlClient } from '@/utils/graphql-instance';
import { ActionIcon, Button, Divider, Stepper } from '@mantine/core';
import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import {
  CircleCheck,
  Pencil,
  Plus,
  ShoppingCart,
  Trash
} from 'tabler-icons-react';
import styles from './Cart.module.css';
import TheAddressModal from './profile/components/TheAddressModal';

const Cart = () => {
  const { protectedAxiosInstance } = useAxiosInstance();
  const { userId } = useAuthContext();

  const [activeStep, setActiveStep] = useState(0);
  const [addressForOrder, setAddressForOrder] = useState<Address>();
  const [selectedAddressId, setSelectedAddressId] = useState<string>();

  const { value: isAddressModalOpen, toggle: toggleAddressModal } =
    useToggle(false);

  const { cart, subTotal, removeFromCart, fetchUserCart } = useCartContext();

  const {
    data: addressList,
    isLoading,
    error
  } = useQuery<Address[]>(
    REACT_QUERY_KEYS.GET_ADDRESSES,
    async () => {
      const res = await createProtectedGraphQlClient().request(GET_ADDRESSES, {
        customer_id: userId
      });
      return res?.addresses;
    },
    {
      onSuccess: res => {
        if (res?.length > 0 && !addressForOrder) {
          setAddressForOrder(res[0]);
        }
      }
    }
  );

  // to test protectedAxiosInstance
  // this will always respond with 401 error
  // useEffect((): void => {
  //   protectedAxiosInstance
  //     .post(`${FAKE_STORE_API_BASE_URL}/auth/login`, {
  //       username: 'wrong',
  //       password: 'wrong'
  //     })
  //     .then(res => {
  //       console.log(res.data);
  //     });
  // }, []);

  useEffect(() => {
    fetchUserCart();
  }, []);

  const handleCheckout = useMutation(
    async () => {
      const { name, mobile, house, street, landmark, city, pincode } =
        addressForOrder as Address;
      const res: AxiosResponse<any> = await protectedAxiosInstance.post(
        `${NETLIFY_FUNCTIONS_BASE_URL}/order`,
        {
          order: cart.map((item: any) => ({
            product_id: item.product.id,
            quantity: item.quantity,
            price: item.product.price
          })),
          customer_id: userId,
          name,
          mobile,
          house,
          street,
          landmark,
          city,
          pincode
        }
      );
      return res?.data?.payment_link;
    },
    {
      onSuccess: res => {
        if (res) {
          window.location.href = res;
        }
      },
      onError: err => {
        console.error(err);
      }
    }
  );

  if (cart.length === 0) {
    return (
      <div className="mx-auto mt-20 grid max-w-md justify-items-center gap-5">
        <p className="text-2xl">Your cart is empty</p>
        <Link to="/">
          <Button leftIcon={<ShoppingCart />}>Shop now!</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto my-5 min-h-full max-w-7xl bg-white px-5 py-10 lg:px-10">
      <div className="mx-auto max-w-3xl">
        <Stepper
          active={activeStep}
          onStepClick={setActiveStep}
          breakpoint="sm"
          size="sm"
        >
          <Stepper.Step label="Cart" description="Cart summary">
            <div className="mx-auto max-w-2xl py-5">
              {cart.map(
                ({ product: { id, price, image, title }, quantity }) => (
                  <div
                    key={id}
                    className={`mb-8 grid items-center border-b-2 border-gray-100 pb-4 ${styles.cartGrid}`}
                  >
                    <div className="h-36 overflow-hidden">
                      <Link to={`/product/${id}`}>
                        <img
                          loading="lazy"
                          className="h-auto min-w-full object-cover"
                          src={image}
                          alt={title}
                        />
                      </Link>
                    </div>
                    <div>
                      <div className="mb-5 flex items-center gap-5">
                        <Link to={`/product/${id}`}>{title}</Link>
                        <ActionIcon
                          size="lg"
                          color="error"
                          aria-label="remove"
                          onClick={() => removeFromCart.mutate(id)}
                          className="text-red-400"
                        >
                          <Trash strokeWidth={1.5} />
                        </ActionIcon>
                      </div>
                      <div className="mb-5 flex items-center gap-5">
                        <span className="font-semibold text-gray-500">
                          &#8377; {price}
                        </span>
                        <ManageCartItem productId={id} quantity={quantity} />
                      </div>
                      <p className="font-semibold text-gray-800">
                        &#8377; {Math.round(price * quantity * 100) / 100}
                      </p>
                    </div>
                  </div>
                )
              )}
              <div className="my-10 text-lg text-gray-700">
                Total Amount:
                <span className="pl-5 text-xl font-semibold">
                  &#8377; {subTotal}
                </span>
              </div>
              <Button
                onClick={() => {
                  setActiveStep(1);
                }}
              >
                Next
              </Button>
            </div>
          </Stepper.Step>
          <Stepper.Step
            label="Delivery Address"
            description="Select a delivery address"
          >
            {/* Addresses */}
            <div className="mx-auto mt-5 max-w-2xl">
              <div className="my-5 grid gap-6">
                {addressList &&
                  addressList.map(address => {
                    const { id, name, house, street, city, pincode } = address;
                    return (
                      <div
                        key={id}
                        className={`max-w-md rounded-md border-2 p-4 text-sm ${
                          addressForOrder?.id === id
                            ? 'border-blue-500'
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="flex justify-between">
                          <p className="text-base">{name}</p>
                          <div className="flex gap-2">
                            <ActionIcon
                              onClick={() => {
                                setSelectedAddressId(id);
                                toggleAddressModal();
                              }}
                            >
                              <Pencil strokeWidth={1.5} />
                            </ActionIcon>
                            <ActionIcon
                              onClick={() => {
                                setAddressForOrder(address);
                              }}
                            >
                              <CircleCheck
                                strokeWidth={1.5}
                                fill={
                                  addressForOrder?.id === id
                                    ? '#228be6'
                                    : 'white'
                                }
                                color={
                                  addressForOrder?.id === id
                                    ? 'white'
                                    : '#228be6'
                                }
                              />
                            </ActionIcon>
                          </div>
                        </div>
                        <div>{house}</div>
                        <div>{street}</div>
                        <div>
                          {city} - {pincode}
                        </div>
                      </div>
                    );
                  })}
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={toggleAddressModal}
                leftIcon={<Plus strokeWidth={1.5} />}
              >
                New Address
              </Button>

              <TheAddressModal
                isAddressModalOpen={isAddressModalOpen}
                toggleAddressModal={toggleAddressModal}
                selectedAddressId={selectedAddressId}
                onClose={() => {
                  setSelectedAddressId(undefined);
                }}
              />
              <div className="mt-5 flex items-center gap-2">
                <Button variant="light" onClick={() => setActiveStep(0)}>
                  Previous
                </Button>
                <Button
                  onClick={() => handleCheckout.mutate()}
                  loading={handleCheckout.isLoading}
                  size="lg"
                >
                  Place Order
                </Button>
              </div>
            </div>
          </Stepper.Step>
        </Stepper>
      </div>
    </div>
  );
};

export default Cart;
