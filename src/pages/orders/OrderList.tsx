import { ORDER_STATUS } from '@/constants/app.constants';
import { useAuthContext } from '@/context/auth.context';
import { useGetOrdersQuery } from '@/utils/__generated__/graphql';
import { Avatar, AvatarsGroup, Loader } from '@mantine/core';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Clock, DiscountCheck, Package } from 'tabler-icons-react';

const OrderList = () => {
  const { userId } = useAuthContext();

  const {
    data: orderList,
    isLoading,
    error
  } = useGetOrdersQuery(
    {
      customer_id: userId
    },
    {
      select: res => res.orders
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
      <div className="mx-auto max-w-2xl">
        <h2 className="mb-5">
          <Package
            strokeWidth={1}
            size={42}
            color={'#228be6'}
            className="inline-block"
          />
          My Orders
        </h2>
        {orderList &&
          orderList.map(order => (
            <Link to={`/orders/${order.id}`} key={order.id}>
              <div
                key={order.id}
                className="mb-5 rounded-md border-2 border-gray-400 p-5"
              >
                <div>
                  <AvatarsGroup limit={5} total={order.order_items.length}>
                    {order.order_items.map(({ product: { id, image } }) => (
                      <Avatar src={image} key={id} size="xl" radius="md" />
                    ))}
                  </AvatarsGroup>
                </div>
                <div className="grid gap-2">
                  <p>
                    <span className="text-gray-600">Amount: </span>
                    &#8377; {order.amount}
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
                    <span className="text-gray-600">Ordered on: </span>
                    {format(new Date(order.created_at), 'dd MMMM yyyy')}
                  </p>
                  <p>
                    <span className="text-gray-600">Delivery to: </span>
                    {order.name}
                  </p>
                  <p>
                    {order.city}, {order.pincode}
                  </p>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default OrderList;
