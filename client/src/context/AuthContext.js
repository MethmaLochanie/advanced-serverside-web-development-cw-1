import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // Validate token and fetch user data
      validateToken();
    } else {
      setLoading(false);
    }
  }, [token]);

  const validateToken = async () => {
    try {
      const { user: userData } = await authService.validateToken(token);
      setUser(userData);
      setLoading(false);
    } catch (error) {
      logout();
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const { token: newToken, user: userData } = await authService.login(email, password);
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      return { success: true };
    } catch (error) {
      const errData = error.response?.data;
      if (errData?.errors) {
        return { success: false, error: errData.errors };
      }
      return {
        success: false,
        error: errData?.message || 'Login failed'
      };
    }
  };

  const register = async (username, email, password) => {
    try {
      const data = await authService.register(username, email, password);
      return { success: true, data };
    } catch (error) {
      const errData = error.response?.data;
      if (errData?.errors) {
        return { success: false, error: errData.errors };
      }
      return {
        success: false,
        error: errData?.message || 'Registration failed'
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  const value = {
    user,
    token,
    isAuthenticated: user,
    loading,
    validateToken,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 