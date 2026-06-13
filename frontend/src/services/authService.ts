// ============================================
// Auth Service — Real API authentication
// ============================================

import api from './api';
import type { AuthResponse, LoginRequest, RegisterRequest, StudentProfile } from '../types';

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);
    const authData: AuthResponse = response.data.data;
    sessionStorage.setItem('mytrackify_token', authData.token);
    sessionStorage.setItem('mytrackify_user', JSON.stringify(authData.user));
    return authData;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post('/auth/register', data);
    const authData: AuthResponse = response.data.data;
    sessionStorage.setItem('mytrackify_token', authData.token);
    sessionStorage.setItem('mytrackify_user', JSON.stringify(authData.user));
    return authData;
  },

  logout(): void {
    sessionStorage.removeItem('mytrackify_token');
    sessionStorage.removeItem('mytrackify_user');
  },

  getCurrentUser(): StudentProfile | null {
    const data = sessionStorage.getItem('mytrackify_user');
    return data ? JSON.parse(data) : null;
  },

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('mytrackify_token');
  },
};
