// src/components/layout/Sidebar.tsx
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Video,
  Tv,
  User,
  PlusCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  const linkClass = (path: string) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
      location.pathname === path
        ? "bg-purple-600 text-white"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <aside className="hidden md:flex flex-col w-56 bg-slate-900 border-r border-white/10 h-screen fixed left-0 top-0 pt-20 px-3">
      
      {/* HOME */}
      <Link to="/" className={linkClass("/")}>
        <Home className="w-5 h-5" />
        Inicio
      </Link>

      {/* CLIPS */}
      <Link to="/live" className={linkClass("/live")}>
        <Video className="w-5 h-5" />
        Clips
      </Link>

      {/* UPLOAD CLIP */}
      {user && (
        <Link to="/clips/upload" className={linkClass("/clips/upload")}>
          <PlusCircle className="w-5 h-5" />
          Subir Clip
        </Link>
      )}

      {/* DASHBOARD */}
      {user && (
        <Link to="/dashboard" className={linkClass("/dashboard")}>
          <Tv className="w-5 h-5" />
          Dashboard
        </Link>
      )}

      {/* PERFIL */}
      {user && (
        <Link to="/profile" className={linkClass("/profile")}>
          <User className="w-5 h-5" />
          Perfil
        </Link>
      )}
    </aside>
  );
}
