import '@//App.css';
import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

// components
import NavBar from '@/components/NavBar';

// lazy load
const Home = lazy(() => import('@/pages/Home'));
const Register = lazy(() => import('@/pages/accounts/Register'));
const Login = lazy(() => import('@/pages/accounts/Login'));
const Cart = lazy(() => import('@/pages/Cart'));
const ProductView = lazy(() => import('@/pages/ProductView'));

function App() {
  return (
    <Router>
      <NavBar />
      <Suspense fallback={<div>Loading</div>}>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/accounts/login" component={Login} />
          <Route path="/accounts/register" component={Register} />
          <Route path="/cart" component={Cart} />
          <Route path="/product/:id" component={ProductView} />
        </Switch>
      </Suspense>
    </Router>
  );
}

export default App;
