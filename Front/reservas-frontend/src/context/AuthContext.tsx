import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { UserDTO } from '../types/auth.types';

interface AuthContextType {
  user: UserDTO | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (usuario: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Al montar, revisamos si hay token guardado
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  // ✅ Función de login
  const login = async (usuario: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await axios.post('/api/auth/login', {
        usuario,   // 👈 coincide con LoginDTO del back
        password   // 👈 coincide con LoginDTO del back
      });

      const { token, user } = response.data;

      // Guardamos en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Configuramos axios para enviar el token en cada request
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser(user);
      setIsAuthenticated(true);
    } catch (error: any) {
      throw error.response?.data?.message || 'Error al iniciar sesión';
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Función de logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
