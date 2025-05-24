import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Container
} from '@mui/material';
import {
  Feed as FeedIcon,
  Person as PersonIcon,
  Add as AddIcon,
  Logout
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={() => navigate('/feed')}
          >
            TravelTales
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button 
              color="inherit" 
              onClick={() => navigate('/')}
            >
              Home
            </Button>
            {isLoggedIn && (
              <>
                <Button 
                  color="inherit" 
                  onClick={() => navigate('/feed')}
                  startIcon={<FeedIcon />}
                >
                  Feed
                </Button>
                <Button 
                  color="inherit" 
                  onClick={() => navigate('/posts')}
                >
                  My Posts
                </Button>
                <Button 
                  color="inherit" 
                  onClick={() => navigate('/posts/create')}
                  startIcon={<AddIcon />}
                >
                  Create Post
                </Button>
                <Button 
                  color="inherit" 
                  onClick={() => navigate(`/profile/${user?.id}`)}
                  startIcon={<PersonIcon />}
                >
                  {user?.username || 'Profile'}
                </Button>
                <Button 
                  color="inherit" 
                  onClick={handleLogout}
                  startIcon={<Logout />}
                >
                  Logout
                </Button>
              </>
            )}
            {!isLoggedIn && (
              <Button 
                color="inherit" 
                onClick={() => navigate('/login')}
                startIcon={<Logout />}
              >
                Log In
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout; 