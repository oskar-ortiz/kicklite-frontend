import axios from 'axios';

export const API_URL = "https://streamora-backend.onrender.com";
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
    byId: (streamId: string) => `/api/streams/${streamId}`, // ⚠ confirmar con tu backend
    start: `/api/streams/start`,
    end: `/api/streams/stop`, // ✔ correcto
  },

  categories: {
    all: `/api/categories`,
    byId: (categoryId: string) => `/api/categories/${categoryId}`,
  },

  chat: {
    messages: (streamId: string) => `/api/chat/${streamId}`,
    send: (streamId: string) => `/api/chat/${streamId}/send`,
  },

  health: `/api/health`,
};

export const axiosConfig = {
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
};

export const api = axios.create(axiosConfig);

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const url = (config.url || "").replace(/\/+/, "/");
    const base = (config.baseURL || API_BASE_URL).replace(/\/+$/, "");

    console.log("📤 Request:", config.method?.toUpperCase(), `${base}${url}`);

    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => {
    console.log("✅ Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error("❌ Response Error:", {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url,
    });

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
    }

    if (!error.response) {
      console.error("🌐 Backend no responde:", API_BASE_URL);
    }

    return Promise.reject(error);
  }
);

export default api;
