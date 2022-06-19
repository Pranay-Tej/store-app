import { useAuthContext } from '@/context/auth.context';
import { useCartContext } from '@/context/cart.context';
import {
  ActionIcon,
  Avatar,
  Button,
  Indicator,
  Menu,
  Tooltip
} from '@mantine/core';
import { Link, useHistory } from 'react-router-dom';
import { Location, Logout, ShoppingCart, SmartHome } from 'tabler-icons-react';

const NavBar = () => {
  const history = useHistory();

  const { isAuthenticated, logout } = useAuthContext();

  const { cart, clearCart } = useCartContext();

  const handleLogout = () => {
    clearCart();
    logout();
  };

  return (
    <nav className="sticky top-0 w-full bg-white shadow-md">
      <div className="mx-auto flex max-w-5xl justify-between p-3 align-middle">
        <div>
          <Link to="/">
            <ActionIcon aria-label="delete">
              <SmartHome />
            </ActionIcon>
          </Link>
        </div>
        <div className="flex gap-4">
          {isAuthenticated === false && (
            <>
              <Link to="/accounts/register">
                <Button>Signup</Button>
              </Link>
              <Link to="/accounts/login">
                <Button>Login</Button>
              </Link>
            </>
          )}
          {isAuthenticated && (
            <>
              <Menu
                withArrow
                control={
                  <Tooltip label="Account settings">
                    <ActionIcon>
                      <Avatar alt="no image here" color="indigo">
                        SP
                      </Avatar>
                    </ActionIcon>
                  </Tooltip>
                }
              >
                <Menu.Item
                  onClick={() => history.push('/profile/addresses')}
                  icon={<Location />}
                >
                  My Addresses
                </Menu.Item>
                <Menu.Item onClick={handleLogout} icon={<Logout />}>
                  Logout
                </Menu.Item>
              </Menu>
              <Link to="/cart">
                <Tooltip label="Cart">
                  <ActionIcon aria-label="delete">
                    <Indicator label={cart.length}>
                      <ShoppingCart />
                    </Indicator>
                  </ActionIcon>
                </Tooltip>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
