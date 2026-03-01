import { User } from '../types/auth';

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'torisho_access_token',
  USER: 'torisho_user',
} as const;

export const AuthStorage = {
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  setAccessToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  },

  removeAccessToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  getUser(): User | null {
    if (typeof window === 'undefined') return null;
    try {
      const userJson = localStorage.getItem(STORAGE_KEYS.USER);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Failed to parse user data:', error);
      return null;
    }
  },

  setUser(user: User): void {
    if (typeof window === 'undefined') return;
    // Filter to only store public user data
    const publicUserData: User = {
      id: user.id,
      username: user.username,
      email: user.email,
      avatarUrl: user.avatarUrl,
      role: user.role,
    };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(publicUserData));
  },

  removeUser(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  clearAll(): void {
    if (typeof window === 'undefined') return;
    this.removeAccessToken();
    this.removeUser();
    this.cleanupLegacyKeys();
  },

  isAuthenticated(): boolean {
    return this.getAccessToken() !== null && this.getUser() !== null;
  },

  cleanupLegacyKeys(): void {
    if (typeof window === 'undefined') return;
    const legacyKeys = ['access-token', 'accessToken', 'refreshToken', 'token', 'auth-storage'];
    legacyKeys.forEach(key => localStorage.removeItem(key));
  },
};
