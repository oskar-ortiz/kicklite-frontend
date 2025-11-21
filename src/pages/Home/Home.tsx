import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Play, Sparkles, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { api, API_ENDPOINTS } from "../../services/api/api.config";

import { getAllClips } from "../../services/api/clipService";
import ClipCard, { ClipType } from "../../components/clips/ClipCard";

export default function Home() {
  const [clips, setClips] = useState<ClipType[]>([]);
  const [loadingClips, setLoadingClips] = useState(true);

  const [startingStream, setStartingStream] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllClips();
        setClips(data || []);
      } catch (err) {
        console.error("❌ Error cargando clips:", err);
      } finally {
        setLoadingClips(false);
      }
    };

    load();
  }, []);

  const handleStartStreaming = async () => {
    if (!isAuthenticated) return navigate("/login");

    try {
      setStartingStream(true);

      const res = await api.post(API_ENDPOINTS.streams.start);
      const id = res.data?.id || res.data?.stream?.id;

      if (id) navigate(`/stream/${id}`);
      else navigate("/dashboard");
    } catch (err) {
      navigate("/dashboard");
    } finally {
      setStartingStream(false);
    }
  };

  const handleViewClips = () => navigate("/live");

  return (
    <div className="min-h-screen bg-slate-950">
      {/* HERO */}
      <motion.section className="relative min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 overflow-hidden">
        <div className="relative z-10 container mx-auto px-6 py-24">
          <div className="flex flex-col lg:flex-row items-center gap-12">

            {/* TEXT */}
            <motion.div className="flex-1 text-center lg:text-left">
              <motion.div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 backdrop-blur-sm mb-6">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-purple-300">
                  #1 Plataforma para Streamers
                </span>
              </motion.div>

              <motion.h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                <span className="text-white">streamora</span>
                <span className="text-white/40">.space</span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  Stream. Crea. Conecta.
                </span>
              </motion.h1>

              <motion.p className="text-lg md:text-xl text-slate-300 mb-8">
                Transmite en vivo o comparte tus mejores momentos.
              </motion.p>

              <motion.div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">

                {/* STREAM */}
                <motion.button
                  onClick={handleStartStreaming}
                  disabled={startingStream}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-semibold"
                >
                  {startingStream ? "Iniciando..." : "Comenzar a Streamear"}
                </motion.button>

                {/* VER CLIPS */}
                <motion.button
                  onClick={handleViewClips}
                  className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl text-white"
                >
                  Ver Clips
                </motion.button>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </motion.section>

      {/* CLIPS GRID */}
      <section className="py-16 bg-slate-950">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-6">Clips del Canal</h2>

          {loadingClips ? (
            <p className="text-slate-400">Cargando clips...</p>
          ) : clips.length === 0 ? (
            <p className="text-slate-400">No hay clips todavía.</p>
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
