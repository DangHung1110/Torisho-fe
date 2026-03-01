import { LoginRequest, RegisterRequest, AuthResponse } from '../types/auth';
import { AuthStorage } from '../libs/auth-storage';

const API_URL = process.env.NEXT_PUBLIC_BE_URL || 'http://localhost:5118/api';

export class AuthService {
  static async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Required for httpOnly cookies
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Login failed');
    }

    const result: AuthResponse = await response.json();
    
    if (result.accessToken) AuthStorage.setAccessToken(result.accessToken);
    if (result.user) AuthStorage.setUser(result.user);
    AuthStorage.cleanupLegacyKeys();
    
    return result;
  }

  static async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Registration failed');
    }

    const result: AuthResponse = await response.json();
    
    // Don't auto-login after registration - user must login manually
    return result;
  }

  static async logout(): Promise<void> {
    const token = AuthStorage.getAccessToken();
    
    if (token) {
      try {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          credentials: 'include',
        });
      } catch (error) {
        console.error('Logout request failed:', error);
      }
    }
    
    AuthStorage.clearAll();
    
    // Redirect to home page after logout
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }

  static getCurrentUser() {
    return AuthStorage.getUser();
  }

  static isAuthenticated(): boolean {
    return AuthStorage.isAuthenticated();
  }

  static getAccessToken(): string | null {
    return AuthStorage.getAccessToken();
  }

  static loginWithDiscord() {
    window.location.href = `${API_URL}/auth/discord`;
  }

  static loginWithGoogle() {
    window.location.href = `${API_URL}/auth/google`;
  }
}
