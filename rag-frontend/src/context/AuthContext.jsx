import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Hydrate user profile if token is present on initial load
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
          setToken(storedToken);
        } catch (error) {
          console.error('Session hydration failed:', error);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Login handler
  const login = async (email, password) => {
    try {
      setLoading(true);
      const data = await authService.login(email, password);
      const accessToken = data.access_token;

      localStorage.setItem('token', accessToken);
      setToken(accessToken);

      // Fetch user profile using the new token
      const userData = await authService.getCurrentUser();
      setUser(userData);

      toast.success('Welcome back to DocuChat AI!');
      return userData;
    } catch (error) {
      const message = error.response?.data?.detail || 'Invalid email or password.';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const register = async (email, password) => {
    try {
      setLoading(true);
      await authService.register(email, password);
      toast.success('Account created successfully! Logging you in...');

      // Auto-login after successful registration
      return await login(email, password);
    } catch (error) {
      const message = error.response?.data?.detail || 'Registration failed. Please try again.';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully.');
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
