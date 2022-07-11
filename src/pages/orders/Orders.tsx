import { Route, Switch } from 'react-router-dom';
import Order from './Order';
import OrderList from './OrderList';

const Orders = () => {
  return (
    <Switch>
      <Route exact path="/orders" component={OrderList} />
      <Route path="/orders/:id" component={Order} />
    </Switch>
  );
};

export default Orders;
