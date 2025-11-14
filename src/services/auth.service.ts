import api from './api';
import { User } from '../types/user.types';

interface LoginRequest {
    email: string;
    password: string;
}

interface LoginResponse {
    data: {
        user: User;
        token: string;
    };
}

interface RegisterRequest {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    company_id: string;
}

export const authService = {
    // Login
    async login(credentials: LoginRequest): Promise<LoginResponse> {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    // Register
    async register(data: RegisterRequest): Promise<LoginResponse> {
        const response = await api.post('/auth/register', data);
        return response.data;
    },

    // Logout
    async logout(): Promise<void> {
        await api.post('/auth/logout');
    },

    // Get current user
    async getCurrentUser(): Promise<User> {
        const response = await api.get('/auth/me');
        return response.data;
    },

    // Forgot password
    async forgotPassword(email: string): Promise<void> {
        await api.post('/auth/forgot-password', { email });
    },

    // Reset password
    async resetPassword(token: string, password: string): Promise<void> {
        await api.post('/auth/reset-password', { token, password });
    },

    // Verify token
    async verifyToken(): Promise<boolean> {
        try {
            await api.get('/auth/verify');
            return true;
        } catch {
            return false;
        }
    },
};