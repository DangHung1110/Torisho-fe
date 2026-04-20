export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    fullname: string;
    password: string;
    confirmPassword?: string;
}

export interface User {
    id: string;
    username: string;
    email: string;
    avatarUrl?: string;
    role?: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken?: string;
    expiration?: string;
    user: User;
}

export interface ExternalLoginRequest {
    provider: string;
    providerToken: string;
}
