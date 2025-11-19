import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api/api.config';

interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
}

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Verificar token al iniciar - CONECTA CON BACKEND REAL
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      
      // Si no hay token, NO hay usuario
      if (!token) {
        console.log('❌ No hay token guardado');
        setLoading(false);
        return;
      }

      try {
        console.log('🔍 Verificando token con el backend...');
        // ✅ LLAMAR AL BACKEND REAL para obtener datos del usuario
        const response = await api.get('/users/profile');
        setUser(response.data);
        console.log('✅ Usuario cargado desde backend:', response.data);
      } catch (error: any) {
        // Si el token es inválido o expiró, eliminarlo
        console.error('❌ Token inválido o expirado:', error.message);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 Intentando login en:', api.defaults.baseURL + '/auth/login');
      const response = await api.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;

      localStorage.setItem('token', token);
      setUser(userData);
      console.log('✅ Login exitoso:', userData);
    } catch (error: any) {
      console.error('❌ Error en login:', error.response?.data?.message || error.message);
      throw error;
    }
  };

  const signOut = () => {
    localStorage.removeItem('token');
    setUser(null);
    console.log('✅ Sesión cerrada');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};