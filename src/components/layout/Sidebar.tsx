import { Link } from "react-router-dom";
import { Home, Tv2, Gamepad2, TrendingUp, X } from "lucide-react";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <div
      className={`fixed inset-0 z-40 transition-all duration-300 ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* Fondo oscuro */}
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Menu lateral */}
      <div
        className={`absolute left-0 top-0 h-full w-72 bg-slate-900 border-r border-white/10 p-6 transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button onClick={onClose} className="mb-6">
          <X className="w-6 h-6 text-white" />
        </button>

        <nav className="space-y-4 text-white">
          <Link
            to="/"
            className="flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg"
          >
            <Home className="w-5 h-5" /> Home
          </Link>

          <Link
            to="/live"
            className="flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg"
          >
            <Tv2 className="w-5 h-5" /> Live
          </Link>

          <Link
            to="/categories"
            className="flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg"
          >
            <Gamepad2 className="w-5 h-5" /> Categories
          </Link>

          <Link
            to="/trending"
            className="flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg"
          >
            <TrendingUp className="w-5 h-5" /> Trending
          </Link>
        </nav>
      </div>
    </div>
  );
}
