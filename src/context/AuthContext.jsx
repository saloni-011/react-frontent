import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, healthApi, getToken, setToken } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(getToken());
  const [isLoading, setIsLoading] = useState(true);
  const [backendOnline, setBackendOnline] = useState(true);

  // Check backend server health
  const checkBackend = useCallback(async () => {
    const isUp = await healthApi.check();
    setBackendOnline(isUp);
    return isUp;
  }, []);

  // Verify stored token on initial app load
  useEffect(() => {
    let isMounted = true;

    async function initializeAuth() {
      await checkBackend();

      const existingToken = getToken();
      if (!existingToken) {
        if (isMounted) {
          setIsLoading(false);
        }
        return;
      }

      try {
        const userData = await authApi.getCurrentUser();
        if (isMounted) {
          setUser(userData);
        }
      } catch (err) {
        console.warn('Stored token was invalid or expired:', err.message);
        setToken(null);
        if (isMounted) {
          setTokenState(null);
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, [checkBackend]);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    if (res?.token) {
      setToken(res.token);
      setTokenState(res.token);
      setUser(res.user);
      setBackendOnline(true);
    }
    return res;
  };

  const register = async (name, email, password) => {
    const res = await authApi.register({ name, email, password });
    // After registration, automatically login the user
    if (res) {
      return login(email, password);
    }
    return res;
  };

  const logout = () => {
    setToken(null);
    setTokenState(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isLoading,
    backendOnline,
    checkBackend,
    login,
    register,
    logout
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

