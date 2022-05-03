import { useAuthContext } from '@/context/auth.context';
import { useCartStore } from '@/store/cart.store';
import HomeIcon from '@mui/icons-material/Home';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import Logout from '@mui/icons-material/Logout';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

const NavBar = () => {
  const history = useHistory();

  const { isAuthenticated, logout } = useAuthContext();

  const { cart, clearCart } = useCartStore();

  const [anchorEl, setAnchorEl] = useState<any>(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    clearCart();
    logout();
    history.push('/');
  };

  return (
    <nav className="sticky top-0 w-full bg-white shadow-md">
      <div className="mx-auto flex max-w-5xl justify-between p-3 align-middle">
        <div>
          <Link to="/">
            <IconButton aria-label="delete">
              <HomeIcon />
            </IconButton>
          </Link>
        </div>
        <div className="flex gap-4">
          {isAuthenticated === false && (
            <>
              <Link to="/accounts/register">
                <Button variant="text">Signup</Button>
              </Link>
              <Link to="/accounts/login">
                <Button variant="contained">Login</Button>
              </Link>
            </>
          )}
          {isAuthenticated && (
            <>
              <Tooltip title="Account settings">
                <IconButton
                  onClick={handleProfileMenuClick}
                  size="small"
                  sx={{ ml: 2 }}
                >
                  <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
                </IconButton>
              </Tooltip>

              <Menu
                anchorEl={anchorEl}
                open={isMenuOpen}
                onClose={handleProfileMenuClose}
                onClick={handleProfileMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={() => history.push('/profile/addresses')}>
                  <ListItemIcon>
                    <LocationOnOutlinedIcon fontSize="small" />
                  </ListItemIcon>{' '}
                  My Addresses
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
              <Link to="/cart">
                <Tooltip title="Cart">
                  <IconButton aria-label="delete">
                    <Badge badgeContent={cart.length} color="primary">
                      <LocalMallIcon />
                    </Badge>
                  </IconButton>
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
