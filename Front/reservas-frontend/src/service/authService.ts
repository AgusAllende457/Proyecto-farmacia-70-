import { api } from './api';
import { LoginDTO, AuthResponse } from '../types/auth.types';

export const authService = {
    
    async login(credentials: LoginDTO): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/login', credentials);
        return response.data;
    },

    saveAuth(token: string, user: any): void {
        localStorage.setItem('farmacia_token', token);
        localStorage.setItem('farmacia_user', JSON.stringify(user));
    },

    getStoredAuth(): { token: string | null; user: any | null } {
        const token = localStorage.getItem('farmacia_token');
        const userStr = localStorage.getItem('farmacia_user');
        const user = userStr ? JSON.parse(userStr) : null;
        return { token, user };
    },

    clearAuth(): void {
        localStorage.removeItem('farmacia_token');
        localStorage.removeItem('farmacia_user');
    },

    isAuthenticated(): boolean {
        const { token } = this.getStoredAuth();
        return !!token;
    },

    async logout(): Promise<void> {
        try {
            await api.post('/auth/logout');
        } finally {
            this.clearAuth();
        }
    },
};