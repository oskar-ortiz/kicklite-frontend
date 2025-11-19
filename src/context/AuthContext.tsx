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

  // ✅ Verificar token al iniciar
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.log('❌ No hay token guardado');
        setLoading(false);
        return;
      }

      try {
        console.log('🔍 Verificando token con el backend...');
        
        // ✅ USAR EL TOKEN PARA OBTENER LOS DATOS DEL USUARIO
        // Intenta primero /auth/me, si falla intenta /users/profile
        let response;
        try {
          response = await api.get('/auth/me');
        } catch (error) {
          console.log('⚠️ /auth/me no disponible, intentando /users/profile...');
          response = await api.get('/users/profile');
        }
        
        setUser(response.data);
        console.log('✅ Usuario cargado desde backend:', response.data);
      } catch (error: any) {
        console.error('❌ Error al obtener usuario:', error.message);
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
      console.log('🔐 Intentando login...');
      
      // ✅ Paso 1: Hacer login y obtener token
      const loginResponse = await api.post('/auth/login', { email, password });
      const { token } = loginResponse.data;
      
      if (!token) {
        throw new Error('El backend no devolvió un token');
      }

      // ✅ Paso 2: Guardar el token
      localStorage.setItem('token', token);
      console.log('✅ Token guardado');

      // ✅ Paso 3: Usar el token para obtener datos del usuario
      try {
        const userResponse = await api.get('/auth/me');
        setUser(userResponse.data);
        console.log('✅ Usuario obtenido:', userResponse.data);
      } catch (error) {
        console.log('⚠️ /auth/me no disponible, intentando /users/profile...');
        const userResponse = await api.get('/users/profile');
        setUser(userResponse.data);
        console.log('✅ Usuario obtenido:', userResponse.data);
      }

      console.log('✅ Login exitoso');
    } catch (error: any) {
      console.error('❌ Error en login:', error.response?.data?.message || error.message);
      localStorage.removeItem('token');
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