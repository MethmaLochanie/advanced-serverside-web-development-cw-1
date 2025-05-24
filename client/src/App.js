import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import BlogPosts from './pages/BlogPosts';
import CreateBlogPost from './pages/CreateBlogPost';
import EditBlogPost from './pages/EditBlogPost';
import Profile from './pages/Profile';
import FollowedFeed from './components/FollowedFeed';
import Home from './pages/Home';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
 
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }



  return children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            
            {/* Protected routes */}
            <Route path="/posts" element={
              <ProtectedRoute>
                <Layout>
                  <BlogPosts />
                </Layout>
              </ProtectedRoute>
            } />
            

            {/* Blog post routes */}
            <Route path="/posts/create" element={
              <ProtectedRoute>
                <Layout>
                  <CreateBlogPost />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/posts/edit/:id" element={
              <ProtectedRoute>
                <Layout>
                  <EditBlogPost />
                </Layout>
              </ProtectedRoute>
            } />

            {/* Profile and following routes */}
            <Route path="/profile/:userId" element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/feed" element={
              <ProtectedRoute>
                <Layout>
                  <FollowedFeed />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Default route (Home) - public */}
            <Route path="/" element={
              <Layout>
                <Home />
              </Layout>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 