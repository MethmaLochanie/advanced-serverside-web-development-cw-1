import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import PublicLayout from './components/PublicLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Countries from './pages/Countries';
import ApiKeys from './pages/ApiKeys';
import AdminDashboard from './components/admin/AdminDashboard';
import BlogPosts from './pages/BlogPosts';
import CreateBlogPost from './pages/CreateBlogPost';
import EditBlogPost from './pages/EditBlogPost';
import Profile from './pages/Profile';
import FollowedFeed from './components/FollowedFeed';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
 
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // if (requireAdmin && user?.role !== 'admin') {
  //   return <Navigate to="/dashboard" />;
  // }

  return children;
};

// // Admin Route component
// const AdminRoute = () => {
//   console.log('AdminRoute rendering');
//   return (
//     <ProtectedRoute requireAdmin>
//       <Layout>
//         <AdminDashboard />
//       </Layout>
//     </ProtectedRoute>
//   );
// };

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
            
            {/* Admin route */}
            {/* <Route path="/admin" element={<AdminRoute />} /> */}
            
            {/* <Route path="/countries" element={
              <ProtectedRoute>
                <Layout>
                  <Countries />
                </Layout>
              </ProtectedRoute>
            } /> */}
            {/* <Route path="/api-keys" element={
              <ProtectedRoute>
                <Layout>
                  <ApiKeys />
                </Layout>
              </ProtectedRoute>
            } /> */}

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
            
            {/* Default route */}
            <Route path="/" element={<Navigate to="/posts" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 