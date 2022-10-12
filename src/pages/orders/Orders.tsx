import { Route, Routes } from 'react-router-dom';
import Order from './Order';
import OrderList from './OrderList';

const Orders = () => {
  return (
    <Routes>
      <Route path="/" element={<OrderList />} />
      <Route path=":id" element={<Order />} />
    </Routes>
  );
};

export default Orders;
