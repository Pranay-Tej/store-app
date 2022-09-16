import { useAuthContext } from '@/context/auth.context';
import { useUserCartQuery } from '@/context/cart.context';
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
  BrandGithub,
  BuildingStore,
  Logout,
  MapPin,
  Package,
  ShoppingCart
} from 'tabler-icons-react';

const NavBar = () => {
  const { isAuthenticated, logout } = useAuthContext();

  const { data: cart } = useUserCartQuery();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="sticky top-0 z-10 w-full bg-white shadow-md">
      <div className="mx-auto flex max-w-7xl justify-between p-3 align-middle">
        <div>
          <Link to="/">
            <Tooltip label="React Store">
              <ActionIcon size="lg" aria-label="delete">
                <BuildingStore strokeWidth={1.5} />
              </ActionIcon>
            </Tooltip>
          </Link>
        </div>
        <div className="flex gap-4">
          <Tooltip label="GitHub Repo">
            <a
              href="https://github.com/Pranay-Tej/react-store"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ActionIcon size="lg" aria-label="delete">
                <BrandGithub strokeWidth={1.5} />
              </ActionIcon>
            </a>
          </Tooltip>
          {isAuthenticated === false && (
            <>
              <Link to="/accounts/login">
                <Button variant="subtle">Login</Button>
              </Link>
              <Link to="/accounts/register">
                <Button>Signup</Button>
              </Link>
            </>
          )}
          {isAuthenticated && (
            <>
              <Menu withArrow>
                <Menu.Target>
                  <Tooltip label="My Account">
                    <ActionIcon size="lg">
                      <Avatar alt="" color="indigo"></Avatar>
                    </ActionIcon>
                  </Tooltip>
                </Menu.Target>
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
                    <Indicator
                      disabled={(cart?.length ?? 0) === 0}
                      label={cart?.length ?? 0}
                      size={15}
                      radius="xl"
                    >
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
