// src/context/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { api } from "../services/api/api.config";

export interface User {
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
  signOut: () => void;            // ⬅️ Tu API usa signOut, se mantiene igual
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ===========================================================
  // Cargar usuario si existe token
  // ===========================================================
  const refreshUser = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await api.get("/api/auth/me");
      const data = (response.data as any).user || response.data;
      setUser(data);
    } catch (error) {
      console.error("❌ Error en /api/auth/me:", error);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  // ===========================================================
  // LOGIN
  // ===========================================================
  const signIn = async (email: string, password: string) => {
    setLoading(true);

    try {
      const res = await api.post("/api/auth/login", { email, password });

      const { token, user: loginUser } = res.data;

      if (token) localStorage.setItem("token", token);

      if (loginUser) {
        setUser(loginUser);
      } else {
        await refreshUser();
      }
    } catch (error) {
      console.error("❌ Error en login:", error);
      localStorage.removeItem("token");
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ===========================================================
  // LOGOUT
  // ===========================================================
  const signOut = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        signIn,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
