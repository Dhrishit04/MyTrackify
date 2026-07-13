import api from './api';
import { tokenStore } from './tokenStore';
import type { AuthResponse, LoginRequest, RegisterRequest, StudentProfile } from '../types';

/**
 * In-memory token storage (per spec: "Never store JWT in localStorage").
 * Token is held in a module-level variable — lost on page refresh, which is
 * the correct security posture. For persistent sessions, the spec recommends
 * an httpOnly refresh-token cookie (not yet implemented).
 */
export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);
    const authData: AuthResponse = response.data.data;
    tokenStore.setToken(authData.token);
    tokenStore.setUser(authData.user);
    return authData;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post('/auth/register', data);
    const authData: AuthResponse = response.data.data;
    tokenStore.setToken(authData.token);
    tokenStore.setUser(authData.user);
    return authData;
  },

  logout(): void {
    tokenStore.clear();
  },

  getCurrentUser(): StudentProfile | null {
    return tokenStore.getUser<StudentProfile>();
  },

  getToken(): string | null {
    return tokenStore.getToken();
  },

  isAuthenticated(): boolean {
    return tokenStore.getToken() !== null;
  },
};