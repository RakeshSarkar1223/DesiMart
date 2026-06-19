import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

// Ensure Axios sends cookies for cross-origin requests
axios.defaults.withCredentials = true;

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Synchronize session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/profile', { withCredentials: true });
        if (response.status === 200) {
          setUser(response.data);
        }
      } catch (err) {
        console.log('No active session found on mount.');
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  // Login handler
  const login = async (email, password, role) => {
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/v1/login', { email, password, role }, { withCredentials: true });
      const data = response.data;
      
      // Role validation
      const rolesArray = Array.isArray(data.role) ? data.role : [data.role];
      if (!rolesArray.includes(role)) {
        throw new Error(`Unauthorized. This account is registered as [${rolesArray.join(', ')}], which does not include ${role}.`);
      }

      setUser(data);
      toast.success(`Successfully logged in as ${data.name}!`);
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed. Please verify credentials.';
      setError(msg);
      toast.error(msg);
      throw new Error(msg);
    }
  };

  // Registration handler
  const register = async (formData) => {
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/v1/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      const data = response.data;
      setUser(data);
      toast.success("Account created successfully! Welcome aboard.");
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed.';
      setError(msg);
      toast.error(msg);
      throw new Error(msg);
    }
  };

  // Logout handler
  const logout = async () => {
    setError('');
    try {
      await axios.get('http://localhost:5000/api/v1/logout', { withCredentials: true });
      toast.success("Signed out successfully. See you soon!");
    } catch (err) {
      console.error('Logout API call failed:', err);
      toast.error("Logout failed. Please try again.");
    } finally {
      setUser(null);
    }
  };

  // Update Profile handler
  const updateProfile = async (formData) => {
    setError('');
    try {
      await axios.put('http://localhost:5000/api/v1/update', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });

      // Fetch fresh profile data from backend
      const response = await axios.get('http://localhost:5000/api/v1/profile', { withCredentials: true });
      if (response.status === 200) {
        setUser(response.data);
        toast.success("Profile details updated successfully!");
        return response.data;
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update profile.';
      setError(msg);
      toast.error(msg);
      throw new Error(msg);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    setError,
    setUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
