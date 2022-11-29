import { ORDER_STATUS } from '@/constants/app.constants';
import { useGetOrderByPkQuery } from '@/utils/__generated__/graphql';
import { Button, Loader } from '@mantine/core';
import dayjs from 'dayjs';
import { Link, useParams } from 'react-router-dom';
import { Clock, DiscountCheck, RotateClockwise } from 'tabler-icons-react';
import styles from './Order.module.css';

const Order = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: order,
    isLoading,
    error
  } = useGetOrderByPkQuery(
    {
      id
    },
    {
      enabled: id !== undefined,
      select: res => res.orders_by_pk
    }
  );

  if (error) {
    return <div>{JSON.stringify(error)}</div>;
  }

  if (isLoading) {
    return <Loader variant="bars" />;
  }

  return (
    <div className="mx-auto my-5 min-h-full max-w-7xl bg-white px-5 py-10 lg:px-10">
      {order && (
        <div className="mx-auto mb-5 max-w-2xl">
          <div className="mb-8">
            <h2 className="mb-3 font-medium">Order Details</h2>
            <div className=" grid gap-2">
              <p>
                <span className="text-gray-600">Order Id: </span>
                {order.id}
              </p>
              <p className="flex items-center gap-1">
                <span className="text-gray-600">Status: </span>
                {order.status === ORDER_STATUS.PAID && (
                  <DiscountCheck
                    strokeWidth={1.5}
                    color={'#40bf64'}
                    className="inline-block"
                  />
                )}
                {order.status === ORDER_STATUS.PAYMENT_PENDING && (
                  <Clock
                    strokeWidth={1.5}
                    color={'#fdab00'}
                    className="inline-block"
                  />
                )}
                {order.status}
              </p>
              <p>
                <span className="text-gray-600">Amount: </span>&#8377;
                {order.amount}
              </p>
              <p>
                <span className="text-gray-600">Ordered on: </span>
                {dayjs(order.created_at).format('DD MMM YYYY, hh:mm A')}
              </p>
            </div>
          </div>

          {order.status === ORDER_STATUS.PAYMENT_PENDING && (
            <div className="mb-8">
              <a href={order?.payment_link ?? ''}>
                <Button leftIcon={<RotateClockwise strokeWidth={1.5} />}>
                  Retry Payment
                </Button>
              </a>
            </div>
          )}

          <div>
            {order.order_items.map(
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
                    </div>
                    <div className="mb-5 flex items-center gap-5">
                      <span className="font-medium text-gray-500">
                        &#8377; {price} &#10060; {quantity}
                      </span>
                    </div>
                    <p className="font-semibold text-gray-600">
                      &#8377; {Math.round(price * quantity * 100) / 100}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>

          <div>
            <h2 className="mb-3 font-medium">Delivery Address</h2>
            <div className="grid gap-2">
              <p>{order.name}</p>
              <p>{order.mobile}</p>
              <p>{order.house}</p>
              <p>{order.street}</p>
              <p>
                {order.city}, {order.pincode}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;
