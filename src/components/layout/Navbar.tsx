// src/components/layout/Navbar.tsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Menu, LogOut, Tv, Video, PlusCircle } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, signOut } = useAuth(); // ← CAMBIO AQUÍ
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="w-full bg-slate-900/80 backdrop-blur-md border-b border-white/10 fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" className="text-2xl font-bold text-white">
          streamora<span className="text-purple-400">.space</span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/live" className="text-slate-300 hover:text-white transition">
            Ver Clips
          </Link>

          {user && (
            <>
              <Link
                to="/clips/upload"
                className="flex items-center gap-2 text-slate-300 hover:text-white transition"
              >
                <PlusCircle className="w-4 h-4" />
                Subir Clip
              </Link>

              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-slate-300 hover:text-white transition"
              >
                <Tv className="w-4 h-4" />
                Dashboard
              </Link>
            </>
          )}

          {!user ? (
            <>
              <Link to="/login" className="text-purple-400 font-semibold">
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="bg-purple-600 px-4 py-2 rounded-lg text-white font-semibold hover:bg-purple-700"
              >
                Crear cuenta
              </Link>
            </>
          ) : (
            <button
              onClick={() => {
                signOut();   // ← CAMBIO AQUÍ
                navigate("/");
              }}
              className="flex items-center gap-2 text-red-400 hover:text-red-300"
            >
              <LogOut className="w-4 h-4" />
              Salir
            </button>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden text-white"
          onClick={() => setOpen(!open)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-slate-900 border-t border-white/10 p-4 flex flex-col gap-4">
          <Link to="/live" className="text-slate-300 hover:text-white transition">
            Ver Clips
          </Link>

          {user && (
            <>
              <Link
                to="/clips/upload"
                className="flex items-center gap-2 text-slate-300 hover:text-white"
              >
                <Video className="w-4 h-4" />
                Subir Clip
              </Link>
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-slate-300 hover:text-white"
              >
                <Tv className="w-4 h-4" />
                Dashboard
              </Link>
            </>
          )}

          {!user ? (
            <>
              <Link to="/login" className="text-purple-400 font-semibold">
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="bg-purple-600 px-4 py-2 rounded-lg text-white text-center"
              >
                Crear cuenta
              </Link>
            </>
          ) : (
            <button
              onClick={() => {
                signOut();   // ← CAMBIO AQUÍ
                navigate("/");
              }}
              className="flex items-center gap-2 text-red-400 hover:text-red-300"
            >
              <LogOut className="w-4 h-4" />
              Salir
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
