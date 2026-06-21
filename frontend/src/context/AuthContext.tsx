// ============================================
// Auth Context & Provider
// ============================================

import { useState, useCallback, useEffect, type ReactNode } from 'react';
import type { StudentProfile, LoginRequest, RegisterRequest } from '../types';
import { authService } from '../services/authService';
import { AuthContext } from './authContextData';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const initSession = async () => {
      const existingUser = await Promise.resolve(authService.getCurrentUser());
      if (existingUser && authService.isAuthenticated()) {
        setUser(existingUser);
      }
      setIsLoading(false);
    };
    initSession();
  }, []);

  const login = useCallback(async (credentials: LoginRequest): Promise<StudentProfile> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      return response.user;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.register(data);
      setUser(response.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
        login,
        register,
        logout,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
