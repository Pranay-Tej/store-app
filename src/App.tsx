import '@//App.css';
import NavBar from '@/components/NavBar';
import { Loader } from '@mantine/core';
import { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// lazy load
const Home = lazy(() => import('@/pages/Home'));
const Register = lazy(() => import('@/pages/accounts/Register'));
const Login = lazy(() => import('@/pages/accounts/Login'));
const Cart = lazy(() => import('@/pages/Cart'));
const ProductView = lazy(() => import('@/pages/ProductView'));
const Addresses = lazy(() => import('@/pages/profile/Addresses'));
const Payment = lazy(() => import('@/pages/Payment'));
const Orders = lazy(() => import('@/pages/orders/Orders'));

function App() {
  return (
    <>
      <NavBar />
      <Suspense
        fallback={
          <div className="grid min-h-screen place-items-center">
            <Loader variant="bars" />
          </div>
        }
      >
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/accounts/login" component={Login} />
          <Route path="/accounts/register" component={Register} />
          <Route path="/product/:id" component={ProductView} />
          <ProtectedRoute path="/cart">
            <Cart />
          </ProtectedRoute>
          <ProtectedRoute path="/profile/addresses">
            <Addresses />
          </ProtectedRoute>
          <ProtectedRoute path="/payment">
            <Payment />
          </ProtectedRoute>
          <ProtectedRoute path="/orders">
            <Orders />
          </ProtectedRoute>
        </Switch>
      </Suspense>
    </>
  );
}

export default App;
