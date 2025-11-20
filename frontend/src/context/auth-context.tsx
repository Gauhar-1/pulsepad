'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Cookies from 'js-cookie';
import type { Role } from '@/constants/roles';

export type AuthUser = {
  sub: string;
  email: string;
  name?: string;
  picture?: string;
  avatarUrl?: string;
  role: Role;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const USER_STORAGE_KEY = 'pulsepad_auth_user';

const getApiBaseUrl = () => process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const persistUser = (value: AuthUser | null) => {
    if (typeof window === 'undefined') return;
    if (value) {
      window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(value));
    } else {
      window.localStorage.removeItem(USER_STORAGE_KEY);
    }
  };

  const restoreUser = (): AuthUser | null => {
    if (typeof window === 'undefined') return null;
    const raw = window.localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      window.localStorage.removeItem(USER_STORAGE_KEY);
      return null;
    }
  };

  const verifyToken = useCallback(
    async (authToken: string) => {
      try {
        const response = await fetch(`${getApiBaseUrl()}/auth/verify`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Invalid token');
        }

        const data = await response.json();
        setUser(data.user);
        persistUser(data.user);
      } catch (error) {
        console.error('Failed to verify auth token', error);
        Cookies.remove('auth_token');
        setUser(null);
        persistUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    const cookieToken = Cookies.get('auth_token') ?? null;
    const savedUser = restoreUser();

    if (cookieToken) {
      setToken(cookieToken);
      if (savedUser) {
        setUser(savedUser);
      }
      verifyToken(cookieToken);
    } else {
      setUser(null);
      setToken(null);
      persistUser(null);
      setLoading(false);
    }
  }, [verifyToken]);

  const login = useCallback((nextUser: AuthUser, nextToken: string) => {
    setUser(nextUser);
    setToken(nextToken);
    persistUser(nextUser);
    Cookies.set('auth_token', nextToken, {
      path: '/',
      sameSite: 'lax',
      secure: typeof window !== 'undefined' ? window.location.protocol === 'https:' : false,
    });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    Cookies.remove('auth_token');
    persistUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      logout,
    }),
    [user, token, loading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

