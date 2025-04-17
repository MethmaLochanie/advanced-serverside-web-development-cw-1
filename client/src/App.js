import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Countries from './pages/Countries';
import ApiKeys from './pages/ApiKeys';
import AdminDashboard from './components/admin/AdminDashboard';

const ProtectedRoute = ({ children, requireAdmin }) => {
  const { user, isAuthenticated } = useAuth();
 
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

// Admin Route component
const AdminRoute = () => {
  console.log('AdminRoute rendering');
  return (
    <ProtectedRoute requireAdmin>
      <Layout>
        <AdminDashboard />
      </Layout>
    </ProtectedRoute>
  );
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
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Admin route */}
            <Route path="/admin" element={<AdminRoute />} />
            
            <Route path="/countries" element={
              <ProtectedRoute>
                <Layout>
                  <Countries />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/api-keys" element={
              <ProtectedRoute>
                <Layout>
                  <ApiKeys />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Default route */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 