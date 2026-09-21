import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedInUser = async () => {
      const token = localStorage.getItem('fittrack_token');
      if (token) {
        try {
          const response = await api.getMe();
          if (response.success) {
            setUser(response.data);
          } else {
            localStorage.removeItem('fittrack_token');
          }
        } catch (error) {
          console.error('Failed to verify token:', error);
          localStorage.removeItem('fittrack_token');
        }
      }
      setLoading(false);
    };

    checkLoggedInUser();
  }, []);

  const login = async (credentials) => {
    const response = await api.login(credentials);
    if (response.success && response.data.token) {
      localStorage.setItem('fittrack_token', response.data.token);
      setUser(response.data);
      return response.data;
    }
  };

  const register = async (userData) => {
    const response = await api.register(userData);
    if (response.success && response.data.token) {
      localStorage.setItem('fittrack_token', response.data.token);
      setUser(response.data);
      return response.data;
    }
  };

  const logout = () => {
    localStorage.removeItem('fittrack_token');
    setUser(null);
  };

  const updateUser = (updatedUserData) => {
    setUser((prev) => ({ ...prev, ...updatedUserData }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
