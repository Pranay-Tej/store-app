import { useAuthStore } from '@/store/auth.store';
import { useCartStore } from '@/store/cart.store';
import HomeIcon from '@mui/icons-material/Home';
import Logout from '@mui/icons-material/Logout';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import LocalMallIcon from '@mui/icons-material/LocalMall';
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

  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const user = useAuthStore(state => state.user);
  const login = useAuthStore(state => state.login);
  const logout = useAuthStore(state => state.logout);

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

              {/* <Button variant="text" onClick={() => logout()}>
                Logout
              </Button> */}

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
