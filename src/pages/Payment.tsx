import {
  NETLIFY_FUNCTIONS_BASE_URL,
  ORDER_STATUS
} from '@/constants/app.constants';
import { useAxiosInstance } from '@/context/axios.context';
import { useUrlQuery } from '@/hooks/useUrlQuery';
import { Button, Loader } from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DiscountCheck,
  FaceIdError,
  RotateClockwise
} from 'tabler-icons-react';

interface OrderResponse {
  id: string;
  status: ORDER_STATUS;
  message?: string;
  payment_link?: string;
}

const Payment = () => {
  const { protectedAxiosInstance } = useAxiosInstance();
  const [order, setOrder] = useState<OrderResponse>();
  const urlQuery = useUrlQuery();

  const verifyPayment = useMutation(
    async () => {
      const res: AxiosResponse<OrderResponse> =
        await protectedAxiosInstance.post(
          `${NETLIFY_FUNCTIONS_BASE_URL}/verify-payment`,
          {
            order_id: urlQuery.get('order_id'),
            order_token: urlQuery.get('order_token')
          }
        );
      return res?.data;
    },
    {
      onSuccess: res => {
        setOrder(res);
      },
      onError: err => {
        console.error(err);
      }
    }
  );

  useEffect(() => {
    verifyPayment.mutate();
  }, []);

  return (
    <div className="mx-auto my-5 min-h-full max-w-7xl bg-white px-5 py-10 lg:px-10">
      <div className="mx-auto max-w-2xl">
        {verifyPayment.isLoading && (
          <div className="max-w5xl mx-auto">
            <Loader variant="bars" />
            <p>Verifying payment status</p>
          </div>
        )}

        {order?.status === ORDER_STATUS.PAID && (
          <div className="grid justify-items-center gap-2">
            <DiscountCheck
              size={60}
              strokeWidth={1}
              color={'#40bf64'}
              className="inline-block"
            />
            <p>Payment successful</p>
            <p>Order Id: {order.id}</p>
            <Link to={`/orders/${order.id}`}>
              <Button>Go to Order</Button>
            </Link>
          </div>
        )}

        {order?.status === ORDER_STATUS.PAYMENT_PENDING && (
          <div className="grid justify-items-center gap-4">
            <FaceIdError
              size={60}
              strokeWidth={1}
              color={'#862d33'}
              className="inline-block"
            />
            <p>{order?.message}</p>
            <p>Order Id: {order.id}</p>
            <a href={order?.payment_link}>
              <Button leftIcon={<RotateClockwise strokeWidth={1.5} />}>
                Retry Payment
              </Button>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;
