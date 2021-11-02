import { useAuthStore } from '@/store/auth.store';
import { Link } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HomeIcon from '@mui/icons-material/Home';
import { Button, IconButton } from '@mui/material';
import { useCartStore } from '@/store/cart.store';
import Badge from '@mui/material/Badge';

const NavBar = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const user = useAuthStore(state => state.user);
  const login = useAuthStore(state => state.login);
  const logout = useAuthStore(state => state.logout);

  const { cart } = useCartStore();
  return (
    <nav className="sticky top-0 w-full bg-white shadow-md">
      <div className="flex justify-between max-w-5xl p-3 mx-auto align-middle">
        <div>
          <Link to="/">
            <IconButton aria-label="delete">
              <HomeIcon />
            </IconButton>
          </Link>
        </div>
        <div className="flex gap-4">
          {!isAuthenticated && (
            <>
              {/* <Link to="/accounts/register">Signup</Link> */}
              {/* <Link to="/accounts/login">Login</Link> */}
              <Button variant="contained" onClick={() => login()}>
                Login
              </Button>
            </>
          )}
          {isAuthenticated && (
            <>
              <Button variant="text" onClick={() => logout()}>
                Logout
              </Button>

              <Link to="/cart">
                <IconButton aria-label="delete">
                  <Badge badgeContent={cart.length} color="primary">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
