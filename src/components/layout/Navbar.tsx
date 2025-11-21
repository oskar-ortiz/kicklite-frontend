import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-slate-900/40 backdrop-blur-xl border-b border-white/10 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <Link to="/" className="text-2xl font-bold text-white">
          streamora<span className="text-purple-400">.space</span>
        </Link>

        <div className="flex gap-6 text-white">
          <Link to="/clips" className="hover:text-purple-300">
            Ver clips
          </Link>

          <Link to="/login" className="hover:text-purple-300">
            Iniciar sesión
          </Link>

          <Link
            to="/register"
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg"
          >
            Crear cuenta
          </Link>
        </div>
      </div>
    </nav>
  );
}
