import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api, { API_ENDPOINTS } from "../../services/api/api.config";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();

  // Si no hay token en la URL
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <p className="text-red-500 text-xl">Token inválido o faltante.</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");

    if (password !== confirm) {
      setMsg("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      console.log("🔁 Enviando nueva contraseña…");

      await api.post(API_ENDPOINTS.auth.resetPassword, {
        token,
        newPassword: password,
      });

      setMsg("Contraseña actualizada correctamente. Redirigiendo…");

      setTimeout(() => navigate("/login"), 2000);

    } catch (err) {
      console.error("❌ Error reset-password:", err);
      setMsg("Token inválido o expirado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md bg-slate-900 rounded-2xl p-8 shadow-2xl border border-white/5">

        <h1 className="text-2xl font-bold text-white mb-2">Nueva contraseña</h1>
        <p className="text-slate-400 text-sm mb-6">
          Introduce tu nueva contraseña.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-sm text-slate-300 mb-1">Nueva contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-800 text-white rounded-lg px-3 py-2 border border-white/10 focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">Repetir contraseña</label>
            <input
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full bg-slate-800 text-white rounded-lg px-3 py-2 border border-white/10 focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Cambiar contraseña"}
          </button>

        </form>

        {msg && (
          <p className="text-purple-400 text-sm text-center mt-4">{msg}</p>
        )}

      </div>
    </div>
  );
}
