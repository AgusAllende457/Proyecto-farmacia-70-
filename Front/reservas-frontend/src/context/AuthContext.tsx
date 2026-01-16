import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../service/authService';
import { LoginDTO, UserDTO, AuthContextType } from '../types/auth.types';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserDTO | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // Cargar auth del localStorage al iniciar
    useEffect(() => {
        const { token: storedToken, user: storedUser } = authService.getStoredAuth();
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(storedUser);
        }
        setIsLoading(false);
    }, []);

    const login = async (credentials:  LoginDTO) => {
        try {
            const response = await authService.login(credentials);
            
            setToken(response.token);
            setUser(response. user);
            authService.saveAuth(response.token, response. user);

            // Obtener el rol desde localStorage (guardado en Login.tsx)
            const selectedRole = localStorage.getItem('farmacia_role');
            
            // Redirigir según el rol seleccionado (RF8)
            switch (selectedRole) {
                case 'Administrador':
                    navigate('/dashboard/admin');
                    break;
                case 'Operario':
                    navigate('/dashboard/operario');
                    break;
                case 'Cadete':
                    navigate('/dashboard/cadete');
                    break;
                default:
                    // Si no hay rol, usar el del usuario del servidor
                    navigate('/');
            }
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        authService.clearAuth();
        localStorage.removeItem('farmacia_role'); // Limpiar también el rol
        navigate('/login');
    };

    const value: AuthContextType = {
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token && !!user,
        isLoading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
};