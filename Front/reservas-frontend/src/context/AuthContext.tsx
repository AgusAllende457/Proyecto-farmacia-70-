import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from "../service/api";
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

      // 🕵️‍♂️ PASO 1: MIRA LA CONSOLA DEL NAVEGADOR (F12)
      // Si aquí ves cadenas vacías "", el problema está en el Login.tsx
      console.log("Intentando login con:", { Usuario: usuario, Password: password });

      // ✅ PASO 2: ESTRUCTURA PLANA Y MAYÚSCULAS
      // El error nos confirmó que el backend busca "Usuario" y "Password" en la raíz.
      const response = await api.post('/auth/login', { 
        Usuario: usuario, 
        Password: password 
      });

      // ... resto del código (guardar token, etc) ...
      const { token, user } = response.data;


      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;



      setUser(user);
      setIsAuthenticated(true);

    } catch (error: any) {
      console.error("Error en login:", error);
      // Esto captura el mensaje exacto del servidor para mostrártelo
      const mensajeError = error.response?.data?.title || error.response?.data?.message || 'Error al iniciar sesión';
      throw new Error(mensajeError);
    } finally {
      setIsLoading(false);
    }
  }

  // ✅ Función de logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
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