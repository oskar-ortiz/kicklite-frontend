// src/services/api/api.config.ts
import axios from 'axios';

const isDevelopment = import.meta.env.MODE === 'development';

// ✅ URL del backend de tu compañero en Render
export const API_URL = "https://streamora-backend.onrender.com/api";

// ✅ Configuración automática: desarrollo vs producción
export const API_BASE_URL = isDevelopment 
  ? import.meta.env.VITE_API_URL || 'https://streamora-backend.onrender.com/api'
  : API_URL;

export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    logout: `${API_BASE_URL}/auth/logout`,
    refresh: `${API_BASE_URL}/auth/refresh`,
  },
  users: {
    profile: `${API_BASE_URL}/users/profile`,
    update: `${API_BASE_URL}/users/update`,
    follow: (userId: string) => `${API_BASE_URL}/users/${userId}/follow`,
    unfollow: (userId: string) => `${API_BASE_URL}/users/${userId}/unfollow`,
  },
  streams: {
    live: `${API_BASE_URL}/streams/live`,
    byId: (streamId: string) => `${API_BASE_URL}/streams/${streamId}`,
    start: `${API_BASE_URL}/streams/start`,
    end: `${API_BASE_URL}/streams/end`,
  },
  categories: {
    all: `${API_BASE_URL}/categories`,
    byId: (categoryId: string) => `${API_BASE_URL}/categories/${categoryId}`,
  },
  chat: {
    messages: (streamId: string) => `${API_BASE_URL}/chat/${streamId}/messages`,
    send: (streamId: string) => `${API_BASE_URL}/chat/${streamId}/send`,
  },
  health: `${API_BASE_URL}/health`,
};

export const axiosConfig = {
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 segundos para Render (puede tardar en despertar)
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
};

// ✅ Crear instancia de axios
export const api = axios.create(axiosConfig);

// ✅ Interceptor para agregar token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log en desarrollo
    if (isDevelopment) {
      console.log('📤 Request:', config.method?.toUpperCase(), config.url);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// ✅ Interceptor para manejar errores
api.interceptors.response.use(
  (response) => {
    // Log en desarrollo
    if (isDevelopment) {
      console.log('✅ Response:', response.status, response.config.url);
    }
    return response;
  },
  (error) => {
    // Log detallado de errores
    console.error('❌ Response Error:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url,
    });

    // Manejo de errores específicos
    if (error.response?.status === 401) {
      console.warn('🔒 Sesión expirada');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    if (error.response?.status === 403) {
      console.error('🚫 Sin permisos');
    }

    if (error.response?.status === 404) {
      console.error('🔍 Recurso no encontrado');
    }

    if (error.response?.status >= 500) {
      console.error('⚠️ Error del servidor');
    }

    // Error de red (backend no responde)
    if (!error.response) {
      console.error('🌐 Error de red - Verifica:');
      console.error('   1. Backend corriendo en:', API_BASE_URL);
      console.error('   2. CORS configurado correctamente');
      console.error('   3. Tu conexión a internet');
    }

    return Promise.reject(error);
  }
);

// ✅ Health check - Verificar conexión con backend
export const checkBackendHealth = async () => {
  try {
    console.log('🔍 Verificando conexión con backend...');
    const response = await api.get('/health');
    console.log('✅ Backend conectado:', response.data);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('❌ Backend no disponible:', API_BASE_URL);
    return { success: false, error: error.message };
  }
};

// ✅ Log de configuración
console.log('🔧 API Config:', {
  mode: import.meta.env.MODE,
  apiUrl: API_BASE_URL,
  isDevelopment,
  backendUrl: API_URL,
});

// ✅ Test de conexión automático en desarrollo
if (isDevelopment) {
  console.log('🚀 Testing backend connection...');
  checkBackendHealth();
}

export default api;