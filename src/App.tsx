import '@//App.css';
import { lazy, Suspense } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

// components
import NavBar from '@/components/NavBar';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// lazy load
const Home = lazy(() => import('@/pages/Home'));
const Register = lazy(() => import('@/pages/accounts/Register'));
const Login = lazy(() => import('@/pages/accounts/Login'));
const Cart = lazy(() => import('@/pages/Cart'));
const ProductView = lazy(() => import('@/pages/ProductView'));
const Addresses = lazy(() => import('@/pages/profile/Addresses'));

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Suspense fallback={<div>Loading</div>}>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/accounts/login" component={Login} />
          <Route path="/accounts/register" component={Register} />
          <ProtectedRoute path="/cart">
            <Cart />
          </ProtectedRoute>
          <Route path="/product/:id" component={ProductView} />
          <Route path="/profile/addresses" component={Addresses} />
        </Switch>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
