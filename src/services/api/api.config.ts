import axios from "axios";

export const API_URL = "https://streamora-backend.onrender.com";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

export const API_ENDPOINTS = {
  auth: {
    register: "/api/auth/register",
    login: "/api/auth/login",
    verifyEmail: "/api/auth/verify-email",
    forgot: "/api/auth/forgot-password",
    reset: "/api/auth/reset-password",
    me: "/api/auth/me",
  },
  streams: {
    start: "/api/streams/start",
    end: "/api/streams/end",
    byId: (id: string | number) => `/api/streams/${id}`,
    all: "/api/streams",
  },
  clips: {
    all: "/api/clips",
    upload: "/api/clips/upload",
    byId: (id: string | number) => `/api/clips/${id}`,
  },
};
