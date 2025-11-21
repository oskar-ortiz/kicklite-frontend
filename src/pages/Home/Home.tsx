// src/pages/Home/Home.tsx

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Play, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { api, API_ENDPOINTS } from "../../services/api/api.config";

// Clips
import { getAllClips } from "../../services/api/clipService";
import ClipCard, { ClipType } from "../../components/clips/ClipCard";

export default function Home() {
  const [clips, setClips] = useState<ClipType[]>([]);
  const [loadingClips, setLoadingClips] = useState(true);

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [startingStream, setStartingStream] = useState(false);

  // ================================
  // Cargar Clips
  // ================================
  useEffect(() => {
    const loadClips = async () => {
      try {
        const res = await getAllClips();
        setClips(res || []);
      } catch (err) {
        console.error("Error cargando clips:", err);
      } finally {
        setLoadingClips(false);
      }
    };

    loadClips();
  }, []);

  // ================================
  // Crear Stream
  // ================================
  const handleStartStreaming = async () => {
    if (!isAuthenticated) return navigate("/login");

    try {
      setStartingStream(true);

      const res = await api.post(API_ENDPOINTS.streams.start);

      const id = res.data?.id || res.data?.stream?.id;
      if (id) navigate(`/dashboard/live/${id}`);
      else navigate("/dashboard");
    } catch (error) {
      console.error("❌ Error creando stream:", error);
      navigate("/dashboard");
    } finally {
      setStartingStream(false);
    }
  };

  const handleViewClips = () => navigate("/live");

  return (
    <div className="min-h-screen bg-slate-950">

      {/* ================================= */}
      {/*             HERO                  */}
      {/* ================================= */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 overflow-hidden "
      >
        {/* FONDO ANIMADO */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.2, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/4 -left-24 w-96 h-96 bg-purple-600 rounded-full blur-3xl"
          />

          <motion.div
            animate={{ opacity: [0.2, 0.4, 0.2], scale: [1.1, 1, 1.1] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute bottom-1/4 -right-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl"
          />
        </div>

        {/* CONTENIDO HERO */}
        <div className="relative z-10 container mx-auto px-6 py-24">
          <div className="flex flex-col lg:flex-row items-center gap-14">

            {/* TEXTO PRINCIPAL */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="flex-1 text-center lg:text-left"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-400/20 backdrop-blur-sm mb-6"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-purple-300">
                  Plataforma para Streamers
                </span>
              </motion.div>

              {/* Título */}
              <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6">
                streamora<span className="text-purple-400">.space</span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Stream. Crea. Conecta.
                </span>
              </h1>

              <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-xl">
                Comparte tus mejores momentos o transmite en vivo con estilo.
              </p>

              {/* BOTONES */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {/* Empezar stream */}
                <button
                  onClick={handleStartStreaming}
                  disabled={startingStream}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-white shadow-lg hover:opacity-90 transition"
                >
                  {startingStream ? "Iniciando..." : "Comenzar stream"}
                </button>

                {/* Ver clips */}
                <button
                  onClick={handleViewClips}
                  className="px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-white font-semibold hover:bg-white/10 transition"
                >
                  Ver clips
                </button>
              </div>
            </motion.div>

            {/* VIDEO DE PREVIEW */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex-1 max-w-2xl w-full"
            >
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                <video
                  src="https://samplelib.com/lib/preview/mp4/sample-1m.mp4"
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                ></video>

                {/* Overlay Play */}
                <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <Play className="w-10 h-10 text-white ml-1" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ================================= */}
      {/*            GRID DE CLIPS          */}
      {/* ================================= */}
      <section className="py-16 bg-slate-950">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-6">Clips recientes</h2>

          {loadingClips ? (
            <p className="text-slate-400">Cargando clips...</p>
          ) : clips.length === 0 ? (
            <p className="text-slate-400">No hay clips disponibles.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clips.slice(0, 6).map((clip) => (
                <ClipCard
                  key={clip.id}
                  clip={clip}
                  onClick={() => navigate(`/clip/${clip.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
