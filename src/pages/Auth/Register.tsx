import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api/api.config';
import { motion } from 'framer-motion';

export default function Register() {

  // 🔥 VARIABLES QUE TU COMPAÑERO PIDIÓ
  const [step, setStep] = useState<"form" | "verify">("form");
  const [verifyEmail, setVerifyEmail] = useState("");
  const [code, setCode] = useState("");

  // 🔥 VARIABLES ORIGINALES
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ============================================================
  // 🔥 NUEVO handleRegister — pedido por tu compañero
  // ============================================================
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log("📝 Registrando:", email);

      // Guardamos email para verificación
      setVerifyEmail(email);

      await api.post("/api/auth/register", {
        username,
        email,
        password,
      });

      alert("Te enviamos un código de verificación (revisa los logs del backend).");

      // Cambiar a paso 'verify'
      setStep("verify");

    } catch (err: any) {
      console.error("❌ Error al registrarte:", err);
      setError(err.response?.data?.message || "Error al registrarte");
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // 🔥 VERIFICAR CÓDIGO
  // ============================================================
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post("/api/auth/verify-email", {
        email: verifyEmail,
        code,
      });

      alert("Correo verificado correctamente");
      navigate("/login");

    } catch (err: any) {
      console.error("❌ Error verificando código:", err);
      setError(err.response?.data?.message || "Código inválido");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >

        {/* LOGO */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            streamora<span className="text-purple-500">.space</span>
          </h1>
          <p className="text-slate-400">
            {step === "form" ? "Crea tu cuenta" : "Verifica tu correo"}
          </p>
        </div>

        {/* ====================================================== */}
        {/* 🟣 PASO 1 — FORMULARIO DE REGISTRO */}
        {/* ====================================================== */}
        {step === "form" && (
          <div className="bg-slate-800 rounded-lg p-8 shadow-xl">
            <form onSubmit={handleRegister} className="space-y-6">
              
              {/* USERNAME */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-2">
                  Nombre de usuario
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="tu_usuario"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="tu@email.com"
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="••••••••"
                />
                <p className="text-slate-500 text-xs mt-1">Mínimo 6 caracteres</p>
              </div>

              {/* ERROR */}
              {error && (
                <div className="bg-red-500/10 border border-red-500 rounded-lg p-3">
                  <p className="text-red-500 text-sm">{error}</p>
                </div>
              )}

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Registrando...' : 'Registrarse'}
              </button>
            </form>

            {/* IR A LOGIN */}
            <p className="mt-6 text-center text-slate-400 text-sm">
              ¿Ya tienes cuenta?{' '}
              <a href="/login" className="text-purple-400 hover:text-purple-300 font-medium">
                Inicia sesión
              </a>
            </p>
          </div>
        )}

        {/* ====================================================== */}
        {/* 🟣 PASO 2 — VERIFICAR CÓDIGO */}
        {/* ====================================================== */}
        {step === "verify" && (
          <div className="bg-slate-800 rounded-lg p-8 shadow-xl">
            <form onSubmit={handleVerify} className="space-y-6">

              <p className="text-slate-300 text-sm">
                Te enviamos un código al correo:
                <br />
                <span className="text-purple-400">{verifyEmail}</span>
              </p>

              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  Código de verificación
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500"
                  placeholder="123456"
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-purple-600 text-white rounded-lg disabled:opacity-50"
              >
                {loading ? "Verificando..." : "Verificar"}
              </button>

            </form>
          </div>
        )}

      </motion.div>
    </div>
  );
}
