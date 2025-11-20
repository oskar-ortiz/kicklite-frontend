import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../../services/api/api.config";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirm) {
      setMessage("Las contraseñas no coinciden.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/api/auth/reset-password", {
        token,
        password,
      });

      setMessage(res.data.message || "Contraseña restablecida.");
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Error al restablecer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 p-8 rounded-xl border border-white/10 w-full max-w-md"
      >
        <h1 className="text-white text-2xl font-bold mb-4">Restablecer contraseña</h1>

        {!token ? (
          <p className="text-red-500 text-center">Token inválido o expirado.</p>
        ) : (
          <>
            <input
              type="password"
              placeholder="Nueva contraseña"
              className="w-full p-3 bg-slate-800 rounded-lg text-white border border-white/10 mb-4"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Confirmar contraseña"
              className="w-full p-3 bg-slate-800 rounded-lg text-white border border-white/10 mb-4"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full p-3 bg-purple-600 text-white rounded-lg disabled:opacity-50"
            >
              {loading ? "Procesando..." : "Restablecer"}
            </button>

            {message && (
              <p className="text-purple-400 text-sm text-center mt-4">{message}</p>
            )}
          </>
        )}
      </form>
    </div>
  );
}
