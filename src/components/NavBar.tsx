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
import { Link } from 'react-router-dom';
import {
  BuildingStore,
  Logout,
  MapPin,
  Package,
  ShoppingCart
} from 'tabler-icons-react';

const NavBar = () => {
  const { isAuthenticated, logout } = useAuthContext();

  const { cart } = useCartContext();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="sticky top-0 z-10 w-full bg-white shadow-md">
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
                  <Tooltip label="My Account">
                    <ActionIcon size="lg">
                      <Avatar alt="" color="indigo"></Avatar>
                    </ActionIcon>
                  </Tooltip>
                }
              >
                <Link to="/orders">
                  <Menu.Item
                    icon={<Package strokeWidth={1.5} color={'#228be6'} />}
                  >
                    Orders
                  </Menu.Item>
                </Link>
                <Link to="/profile/addresses">
                  <Menu.Item
                    icon={<MapPin strokeWidth={1.5} color={'#228be6'} />}
                  >
                    Addresses
                  </Menu.Item>
                </Link>
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
