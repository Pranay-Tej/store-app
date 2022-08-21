import { NETLIFY_FUNCTIONS_BASE_URL } from '@/constants/app.constants';
import { useAxiosInstance } from '@/context/axios.context';
import { useUrlQuery } from '@/hooks/useUrlQuery';
import { Button, Loader } from '@mantine/core';
import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { DiscountCheck } from 'tabler-icons-react';

const Payment = () => {
  const { protectedAxiosInstance } = useAxiosInstance();
  const [order, setOrder] = useState<any>();
  const urlQuery = useUrlQuery();

  const verifyPayment = useMutation(
    async () => {
      const res: AxiosResponse<any> = await protectedAxiosInstance.post(
        `${NETLIFY_FUNCTIONS_BASE_URL}/verify-payment`,
        {
          order_id: urlQuery.get('order_id'),
          order_token: urlQuery.get('order_token')
        }
      );
      return res?.data?.update_orders_by_pk;
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
        {order?.status === 'PAID' && (
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
      </div>
    </div>
  );
};

export default Payment;
