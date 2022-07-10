import { NETLIFY_FUNCTIONS_BASE_URL } from '@/constants/app.constants';
import { useAxiosInstance } from '@/context/axios.context';
import { useUrlQuery } from '@/hooks/useUrlQuery';
import { Loader } from '@mantine/core';
import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';

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
      {verifyPayment.isLoading && (
        <div className="max-w5xl mx-auto">
          <Loader variant="bars" />
          <p>Verifying payment status</p>
        </div>
      )}
      {order?.status === 'PAID' && (
        <div>
          <p>Payment successful</p>
          <p>Order id: {order.id}</p>
        </div>
      )}
    </div>
  );
};

export default Payment;
