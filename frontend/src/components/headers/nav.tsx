import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Avatar,
  Box,
  Button,
} from '@mui/material';
import { AccountCircle, Logout, Person } from '@mui/icons-material';
import { useAuth } from '../../auth/useAuth';
import { logoutApi } from '../../api/auth';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { user: currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logoutApi();
      logout();
    } catch (error) {
      console.log(error);
    } finally {
      handleClose();
    }
  };

  const handleProfile = () => {
    // navigate(`/profile/${currentUser?.username}`);
    handleClose();
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        bgcolor: 'white',
        color: 'text.primary',
        boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        zIndex: 1100,
      }}
    >
      <Toolbar
        variant="dense"
        sx={{
          justifyContent: 'space-between',
          px: { xs: 1.5, md: 2.5 },
          minHeight: '48px !important',
        }}
      >
        {/* Left - Logo */}
        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '16px', cursor: "pointer" }} onClick={()=>navigate('/')}>
          R
        </Typography>

        {/* Right - User or Login */}
        {currentUser ? (
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, lineHeight: 1.2, fontSize: '14px' }}
              >
                {currentUser.username}
              </Typography>
            </Box>

            <IconButton
              onClick={handleClick}
              size="small"
              sx={{
                p: 0,
                border: '2px solid transparent',
                '&:hover': { borderColor: 'primary.main' },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <Avatar
                src={currentUser.profilePicture}
                sx={{
                  width: 36,
                  height: 36,
                  cursor: 'pointer',
                  '&:hover': { transform: 'scale(1.05)' },
                }}
              >
                <Person fontSize="small" />
              </Avatar>
            </IconButton>

            {/* Dropdown Menu */}
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              PaperProps={{
                elevation: 6,
                sx: {
                  minWidth: 240,
                  borderRadius: 1.5,
                  border: '1px solid rgba(0,0,0,0.08)',
                  mt: 1,
                  '& .MuiMenuItem-root': {
                    px: 1.5,
                    py: 1,
                    borderRadius: 1,
                    mx: 0.5,
                    minHeight: 'auto',
                    '&:hover': { backgroundColor: 'primary.50' },
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <Box sx={{ px: 2, py: 1.5, backgroundColor: 'grey.50' }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar
                    src={currentUser.profilePicture}
                    sx={{ width: 40, height: 40 }}
                  >
                    <Person fontSize="small" />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, fontSize: '14px' }}
                    >
                      {currentUser.username}
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              <MenuItem onClick={handleProfile}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <AccountCircle fontSize="small" />
                </ListItemIcon>
                <ListItemText>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500, fontSize: '14px' }}
                  >
                    My Profile
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: '11px' }}
                  >
                    View and edit profile
                  </Typography>
                </ListItemText>
              </MenuItem>

              <MenuItem
                onClick={handleLogout}
                sx={{
                  color: 'error.main',
                  '&:hover': { backgroundColor: 'error.50' },
                }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <Logout fontSize="small" sx={{ color: 'error.main' }} />
                </ListItemIcon>
                <ListItemText>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500, fontSize: '14px' }}
                  >
                    Logout
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: '11px' }}
                  >
                    Sign out of your account
                  </Typography>
                </ListItemText>
              </MenuItem>
            </Menu>
          </Stack>
        ) : (
          <Button
            variant="outlined"
            size="small"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '13px',
              px: 2,
              py: 0.5,
            }}
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
