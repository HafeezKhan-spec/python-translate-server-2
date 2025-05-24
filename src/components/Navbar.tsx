import { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  IconButton, 
  Menu, 
  MenuItem, 
  Button,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar
} from '@mui/material';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import { 
  Menu as MenuIcon, 
  Home, 
  History, 
  LogOut,
  User,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  
  // Mobile drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Avatar menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  // Handle avatar click
  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  // Handle menu close
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  // Handle logout
  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/login');
  };
  
  // Handle profile navigation
  const handleProfile = () => {
    handleClose();
    navigate('/profile');
  };
  
  // Toggle drawer
  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setDrawerOpen(open);
  };

  // Get initials from user name
  const getInitials = (): string => {
    if (!user) return '';
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
  };

  // Check if a route is active
  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  // Mobile drawer content
  const drawerContent = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        bgcolor: 'primary.main',
        color: 'white'
      }}>
        <Avatar sx={{ 
          bgcolor: 'background.paper', 
          color: 'primary.main',
          width: 56,
          height: 56,
          mb: 1
        }}>
          {getInitials()}
        </Avatar>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {user?.firstName} {user?.lastName}
        </Typography>
        <Typography variant="body2">
          {user?.email}
        </Typography>
      </Box>
      <Divider />
      <List>
        <ListItem 
          button 
          component={RouterLink} 
          to="/" 
          selected={isActive('/')}
          sx={{ 
            py: 1.5,
            '&.Mui-selected': {
              bgcolor: 'rgba(138, 43, 226, 0.1)',
              '&:hover': {
                bgcolor: 'rgba(138, 43, 226, 0.2)'
              }
            }
          }}
        >
          <ListItemIcon>
            <Home size={20} />
          </ListItemIcon>
          <ListItemText primary="Translator" />
        </ListItem>
        <ListItem 
          button 
          component={RouterLink} 
          to="/history" 
          selected={isActive('/history')}
          sx={{ 
            py: 1.5,
            '&.Mui-selected': {
              bgcolor: 'rgba(138, 43, 226, 0.1)',
              '&:hover': {
                bgcolor: 'rgba(138, 43, 226, 0.2)'
              }
            }
          }}
        >
          <ListItemIcon>
            <History size={20} />
          </ListItemIcon>
          <ListItemText primary="History" />
        </ListItem>
        <ListItem 
          button 
          component={RouterLink} 
          to="/profile" 
          selected={isActive('/profile')}
          sx={{ 
            py: 1.5,
            '&.Mui-selected': {
              bgcolor: 'rgba(138, 43, 226, 0.1)',
              '&:hover': {
                bgcolor: 'rgba(138, 43, 226, 0.2)'
              }
            }
          }}
        >
          <ListItemIcon>
            <User size={20} />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button onClick={toggleTheme} sx={{ py: 1.5 }}>
          <ListItemIcon>
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </ListItemIcon>
          <ListItemText primary={theme === 'dark' ? "Light Mode" : "Dark Mode"} />
        </ListItem>
        <ListItem button onClick={handleLogout} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <LogOut size={20} />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        bgcolor: 'background.paper', 
        borderBottom: '1px solid',
        borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      }}
    >
      <Toolbar>
        {/* Logo and title */}
        <Typography
          variant="h6"
          noWrap
          component={RouterLink}
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            mr: 2,
            fontWeight: 700,
            color: 'primary.main',
            textDecoration: 'none',
          }}
        >
          TeluguTranslate
        </Typography>

        {/* Mobile menu */}
        {isMobile ? (
          <>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton 
              onClick={toggleTheme}
              size="large"
              color="inherit"
              sx={{ mr: 1 }}
            >
              {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
            >
              {drawerContent}
            </Drawer>
          </>
        ) : (
          /* Desktop navigation */
          <>
            <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
              <Button
                component={RouterLink}
                to="/"
                color={isActive('/') ? 'primary' : 'inherit'}
                sx={{
                  mx: 1,
                  fontWeight: isActive('/') ? 600 : 400,
                  '&:hover': { bgcolor: 'rgba(138, 43, 226, 0.1)' }
                }}
                startIcon={<Home size={18} />}
              >
                Translator
              </Button>
              <Button
                component={RouterLink}
                to="/history"
                color={isActive('/history') ? 'primary' : 'inherit'}
                sx={{
                  mx: 1,
                  fontWeight: isActive('/history') ? 600 : 400,
                  '&:hover': { bgcolor: 'rgba(138, 43, 226, 0.1)' }
                }}
                startIcon={<History size={18} />}
              >
                History
              </Button>
            </Box>
            
            {/* Theme toggle */}
            <IconButton 
              onClick={toggleTheme}
              size="medium"
              color="inherit"
              sx={{ mr: 2 }}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </IconButton>
            
            {/* User avatar */}
            <Box>
              <IconButton
                onClick={handleAvatarClick}
                size="small"
                sx={{ padding: 0 }}
              >
                <Avatar sx={{ 
                  bgcolor: 'primary.main', 
                  width: 40, 
                  height: 40,
                  '&:hover': { 
                    boxShadow: '0 0 0 2px',
                    borderColor: 'primary.main' 
                  }
                }}>
                  {getInitials()}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    mt: 1,
                    minWidth: 180,
                    borderRadius: 2,
                    overflow: 'visible',
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
              >
                <MenuItem onClick={handleProfile} sx={{ py: 1.5 }}>
                  <User size={18} style={{ marginRight: 10 }} />
                  Profile
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
                  <LogOut size={18} style={{ marginRight: 10 }} />
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;