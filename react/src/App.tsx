import '@//App.css';
import NavBar from '@/components/NavBar';
import { Loader } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { SHIRUDO_BASE_URL } from './constants/app.constants';

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
  // call shirudo every 10 minutes to keep the render app alive
  // useQuery(
  //   ['shirudo'],
  //   async () => {
  //     const res = await axios.get(SHIRUDO_BASE_URL);
  //     // console.log('wakeup shirudo render app');
  //     return res;
  //   },
  //   {
  //     refetchInterval: 1000 * 60 * 10, // 10 minutes
  //     refetchOnWindowFocus: false
  //     // refetchIntervalInBackground: true
  //   }
  // );

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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/accounts/login" element={<Login />} />
          <Route path="/accounts/register" element={<Register />} />
          <Route path="/product/:id" element={<ProductView />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<Cart />} path="cart" />
            <Route element={<Addresses />} path="/profile/addresses" />
            <Route element={<Orders />} path="/orders/*" />
          </Route>
          <Route element={<Payment />} path="/payment" />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
