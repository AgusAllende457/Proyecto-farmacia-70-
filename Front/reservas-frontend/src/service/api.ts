import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

/**
 * IMPORTANTE: 
 * Según tu Program.cs y launchSettings.json, el puerto HTTPS es 7075.
 * Si usas Vite, puedes crear un archivo .env con VITE_API_BASE_URL=https://localhost:7075/api
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para agregar el token JWT a cada request
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('farmacia_token');
        
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar la expiración del token (Error 401)
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('farmacia_token');
            localStorage.removeItem('farmacia_user');
            
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);