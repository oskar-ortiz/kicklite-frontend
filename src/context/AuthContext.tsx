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

  // ✅ Verificar token al iniciar - ESTO ES LO QUE FALTABA
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      
      // Si no hay token, terminar loading y no hacer nada más
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // ✅ LLAMAR AL BACKEND REAL para obtener datos del usuario
        const response = await api.get('/users/profile');
        setUser(response.data);
        console.log('✅ Usuario cargado:', response.data);
      } catch (error) {
        // Si el token es inválido, eliminarlo
        console.error('❌ Token inválido o expirado');
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