import React from 'react';
import type {AuthSession, SafeUser} from '../../types';
import {
  apiRequest,
  clearStoredToken,
  getStoredToken,
  setStoredToken,
} from '../../api/httpClient';

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  user?: SafeUser;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [user, setUser] = React.useState<SafeUser | undefined>();
  const [isLoading, setIsLoading] = React.useState(Boolean(getStoredToken()));

  const loadUser = React.useCallback(async () => {
    const token = getStoredToken();

    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiRequest<{data: SafeUser}>('/api/auth/me');
      setUser(response.data);
    } catch {
      clearStoredToken();
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = React.useCallback(async (email: string, password: string) => {
    const response = await apiRequest<{data: AuthSession}>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({email, password}),
    });

    setStoredToken(response.data.token);
    setUser(response.data.user);
  }, []);

  const logout = React.useCallback(() => {
    clearStoredToken();
    setUser(undefined);
  }, []);

  const value = React.useMemo(
    () => ({
      isAuthenticated: Boolean(user),
      isLoading,
      user,
      login,
      logout,
    }),
    [isLoading, login, logout, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const context = React.useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider.');
  }

  return context;
}
