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
import {
  MapPin,
  Logout,
  ShoppingCart,
  BuildingStore
} from 'tabler-icons-react';

const NavBar = () => {
  const history = useHistory();

  const { isAuthenticated, logout } = useAuthContext();

  const { cart } = useCartContext();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="sticky top-0 w-full bg-white shadow-md">
      <div className="mx-auto flex max-w-7xl justify-between p-3 align-middle">
        <div>
          <Link to="/">
            <ActionIcon size="lg" aria-label="delete">
              <BuildingStore strokeWidth={1.5} />
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
                    <ActionIcon size="lg">
                      <Avatar alt="no image here" color="indigo">
                        SP
                      </Avatar>
                    </ActionIcon>
                  </Tooltip>
                }
              >
                <Menu.Item
                  onClick={() => history.push('/profile/addresses')}
                  icon={<MapPin strokeWidth={1.5} />}
                >
                  My Addresses
                </Menu.Item>
                <Menu.Item
                  onClick={handleLogout}
                  icon={<Logout strokeWidth={1.5} />}
                >
                  Logout
                </Menu.Item>
              </Menu>
              <Link to="/cart">
                <Tooltip label="Cart">
                  <ActionIcon size="lg" aria-label="delete">
                    <Indicator label={cart.length}>
                      <ShoppingCart strokeWidth={1.5} />
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
