import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { API_ENDPOINTS } from "../../services/api/api.config";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      console.log("🔁 Solicitando recuperación para:", email);

      await api.post(API_ENDPOINTS.auth.forgotPassword, { email });

      setMessage(
        "Si el email existe, enviamos un enlace de recuperación. (Revisa los logs del backend)"
      );

      // Opcional: Redirigir después de unos segundos
      setTimeout(() => navigate("/login"), 2500);

    } catch (err: any) {
      console.error("❌ Error forgot-password:", err);
      setMessage("Ocurrió un error al solicitar el cambio de contraseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-900 rounded-2xl p-8 shadow-2xl border border-white/5">

        <h1 className="text-2xl font-bold text-white mb-2">
          Recuperar contraseña
        </h1>

        <p className="text-slate-400 text-sm mb-6">
          Ingresa tu correo y te enviaremos un enlace para restablecer la contraseña.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm text-slate-300 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-800 text-white rounded-lg px-3 py-2 border border-white/10 focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="tu@email.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold disabled:opacity-50"
          >
            {loading ? "Enviando..." : "Enviar enlace"}
          </button>
        </form>

        {message && (
          <p className="text-purple-400 text-sm text-center mt-4">{message}</p>
        )}

      </div>
    </div>
  );
}
