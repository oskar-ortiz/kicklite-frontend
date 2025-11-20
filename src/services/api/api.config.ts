// src/services/api/api.config.ts
import axios from 'axios';

const isDevelopment = import.meta.env.MODE === 'development';

// ✅ URL del backend en Render (sin /api)
export const API_URL = "https://streamora-backend.onrender.com";

// ✅ SIEMPRE usa el backend de Render
export const API_BASE_URL = API_URL;

export const API_ENDPOINTS = {
  auth: {
    login: `/api/auth/login`,
    register: `/api/auth/register`,
    logout: `/api/auth/logout`,
    refresh: `/api/auth/refresh`,
    me: `/api/auth/me`,
  },
  users: {
    profile: `/api/users/profile`,
    update: `/api/users/update`,
    follow: (userId: string) => `/api/users/${userId}/follow`,
    unfollow: (userId: string) => `/api/users/${userId}/unfollow`,
  },
  streams: {
    live: `/api/streams/live`,
    byId: (streamId: string) => `/api/streams/${streamId}`,
    start: `/api/streams/start`,
    end: `/api/streams/end`,
  },
  categories: {
    all: `/api/categories`,
    byId: (categoryId: string) => `/api/categories/${categoryId}`,
  },
  chat: {
    messages: (streamId: string) => `/api/chat/${streamId}/messages`,
    send: (streamId: string) => `/api/chat/${streamId}/send`,
  },
  health: `/api/health`,
};

export const axiosConfig = {
  baseURL: API_BASE_URL,
  timeout: 30000,
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
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // ✅ Log corregido con validación de undefined
    const url = config.url || '';
    const baseURL = config.baseURL || API_BASE_URL;
    console.log('📤 Request:', config.method?.toUpperCase(), `${baseURL}${url}`);
    
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
    console.log('✅ Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url,
    });

    if (error.response?.status === 401) {
      console.warn('🔒 Sesión expirada');
      localStorage.removeItem('token');
    }

    if (!error.response) {
      console.error('🌐 Error de red - Backend no responde');
      console.error('   URL:', API_BASE_URL);
    }

    return Promise.reject(error);
  }
);

// ✅ Health check
export const checkBackendHealth = async () => {
  try {
    console.log('🔍 Verificando backend:', `${API_BASE_URL}/api/health`);
    const response = await api.get('/api/health');
    console.log('✅ Backend conectado:', response.data);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('❌ Backend no disponible');
    console.error('   URL intentada:', `${API_BASE_URL}/api/health`);
    console.error('   Error:', error.message);
    return { success: false, error: error.message };
  }
};

// ✅ Log de configuración inicial
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🔧 API Configuration');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('Mode:', import.meta.env.MODE);
console.log('Backend URL:', API_BASE_URL);
console.log('Environment:', isDevelopment ? 'Development' : 'Production');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

export default api;