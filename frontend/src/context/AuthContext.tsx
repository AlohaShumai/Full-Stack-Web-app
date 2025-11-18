// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../api';

type User = {
  id: number;
  email: string;
  name?: string | null;
  role?: 'USER' | 'ADMIN';
};

type AuthContextValue = {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on first render
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setAccessToken(storedToken);
      setUser(JSON.parse(storedUser));
      api.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
    }

    setIsLoading(false);
  }, []);

  const handleAuthResponse = (data: any) => {
    const { user, accessToken, refreshToken } = data;

    setUser(user);
    setAccessToken(accessToken);

    // Store for demo purposes
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));

    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  };

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    handleAuthResponse(res.data);
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await api.post('/auth/register', { name, email, password });
    handleAuthResponse(res.data);
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    delete api.defaults.headers.common.Authorization;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};
