import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Play,
  TrendingUp,
  Users,
  Sparkles,
  Eye,
  Radio,
  Heart,
  UserPlus,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  getLiveStreams,
  getCategories,
  type Stream,
  type Category,
} from "../../services/api/streamService";
import { safeLocale, safeNumber } from "../../utils/safeFormat";
import { useAuth } from "../../context/AuthContext";
import { api, API_ENDPOINTS } from "../../services/api/api.config";

export default function Home() {
  const [liveStreams, setLiveStreams] = useState<Stream[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [startingStream, setStartingStream] = useState(false);

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [streamsData, categoriesData] = await Promise.all([
          getLiveStreams(),
          getCategories(),
        ]);

        setLiveStreams(streamsData || []);
        setCategories(categoriesData || []);
      } catch (err) {
        console.error("❌ Error cargando datos:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Handler para el botón "Comenzar a Streamear"
  const handleStartStreaming = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      setStartingStream(true);

      const res = await api.post(API_ENDPOINTS.streams.start);
      const data = res.data || {};
      const streamId = data.id || data.stream?.id;

      if (streamId) {
        navigate(`/stream/${streamId}`);
      } else {
        // Si el backend aún no devuelve id, al menos vamos al dashboard
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("❌ Error al iniciar stream:", err);
      // Fallback seguro
      navigate("/dashboard");
    } finally {
      setStartingStream(false);
    }
  };

  // Handler para "Ver Streams en Vivo"
  const handleViewLive = () => {
    navigate("/live");
  };

  // Fallback si el backend no responde
  const fallbackStreams: Stream[] = [
    {
      id: "1",
      title: "The King",
      viewerCount: 24532,
      category: "Valorant",
      user: { id: "1", username: "TheKing", avatarUrl: "👑" },
      isLive: true,
      description: "Gameplay épico en ranked",
      thumbnailUrl: undefined,
      tags: [],
      startedAt: undefined,
    },
    {
      id: "2",
      title: "ProGamer",
      viewerCount: 18234,
      category: "LOL",
      user: { id: "2", username: "ProGamer", avatarUrl: "🎮" },
      isLive: true,
      description: "Road to Challenger",
      thumbnailUrl: undefined,
      tags: [],
      startedAt: undefined,
    },
    {
      id: "3",
      title: "StreamQueen",
      viewerCount: 12456,
      category: "Just Chatting",
      user: { id: "3", username: "StreamQueen", avatarUrl: "👸" },
      isLive: true,
      description: "Charlando con la comunidad",
      thumbnailUrl: undefined,
      tags: [],
      startedAt: undefined,
    },
  ];

  const fallbackCategories: Category[] = [
    { id: "1", name: "Valorant", viewerCount: 245000 },
    { id: "2", name: "League of Legends", viewerCount: 189000 },
    { id: "3", name: "Minecraft", viewerCount: 134000 },
    { id: "4", name: "GTA V", viewerCount: 112000 },
  ];

  const displayStreams = liveStreams.length > 0 ? liveStreams : fallbackStreams;
  const displayCategories =
    categories.length > 0 ? categories : fallbackCategories;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* HERO */}
      <section className="relative min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 overflow-hidden">
        {/* Fondo animado */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />

          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10 container mx-auto px-6 py-20">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Texto principal */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex-1 text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 backdrop-blur-sm mb-6"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-purple-300">
                  #1 Plataforma para Streamers
                </span>
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                <span className="text-white">streamora</span>
                <span className="text-white/40">.space</span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  Stream. Crea. Conecta.
                </span>
              </h1>

              <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl">
                La plataforma de streaming más innovadora. Transmite en vivo,
                construye tu comunidad y monetiza tu contenido sin límites.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStartStreaming}
                  disabled={startingStream}
                  className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-white shadow-lg shadow-purple-500/50 overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center gap-2 justify-center">
                    <Play className="w-5 h-5" />
                    {startingStream ? "Iniciando stream..." : "Comenzar a Streamear"}
                  </span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleViewLive}
                  className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl font-semibold text-white hover:bg-white/10 transition-all"
                >
                  Ver Streams en Vivo
                </motion.button>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-8 mt-12 justify-center lg:justify-start">
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-white">
                    {loading ? "..." : `${displayStreams.length}+`}
                  </div>
                  <div className="text-sm text-slate-400">Streams en Vivo</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-white">10M+</div>
                  <div className="text-sm text-slate-400">Espectadores</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-white">24/7</div>
                  <div className="text-sm text-slate-400">Contenido Live</div>
                </div>
              </div>
            </motion.div>

            {/* Tarjeta preview */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex-1 w-full max-w-2xl"
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-2xl opacity-75 group-hover:opacity-100 transition-opacity" />

                <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                  <div className="relative aspect-video bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-xl overflow-hidden mb-4">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center"
                      >
                        <Play className="w-10 h-10 text-white ml-1" />
                      </motion.div>
                    </div>

                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <motion.div
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-3 h-3 bg-red-500 rounded-full"
                      />
                      <span className="px-3 py-1 bg-red-500 rounded-full text-xs font-bold text-white">
                        EN VIVO
                      </span>
                    </div>

                    <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full flex items-center gap-2">
                      <Users className="w-4 h-4 text-white" />
                      <span className="text-sm font-semibold text-white">
                        24.5K
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                      TK
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-lg mb-1">
                        The King - Gameplay Épico
                      </h3>
                      <p className="text-slate-400 text-sm mb-2">
                        Valorant • Ranked • !discord
                      </p>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-green-400 font-medium">
                          +2.5K espectadores
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STREAMS EN VIVO */}
      <section className="py-16 bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">Canales en Vivo</h2>
            <button
              onClick={handleViewLive}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-all"
            >
              Ver Todos
            </button>
          </div>

          {loading ? (
            <div className="text-center text-slate-400 py-12">
              Cargando streams...
            </div>
          ) : displayStreams.length === 0 ? (
            <div className="text-center text-slate-400 py-12">
              No hay streams en vivo en este momento
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayStreams.slice(0, 6).map((stream, i) => (
                <motion.div
                  key={stream.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group relative cursor-pointer"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-75 blur-lg transition-opacity" />

                  <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10">
                    <div className="relative aspect-video overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600" />
                      <div className="absolute inset-0 bg-black/40" />

                      {stream.isLive && (
                        <div className="absolute top-3 left-3 px-3 py-1.5 bg-red-500 rounded-lg flex items-center gap-2">
                          <Radio className="w-3 h-3 text-white animate-pulse" />
                          <span className="font-bold text-white text-xs">
                            EN VIVO
                          </span>
                        </div>
                      )}

                      <div className="absolute top-3 right-3 px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-lg flex items-center gap-2">
                        <Eye className="w-3 h-3 text-white" />
                        <span className="font-semibold text-white text-xs">
                          {safeLocale(stream.viewerCount)}
                        </span>
                      </div>

                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <Play className="w-8 h-8 text-white ml-1" />
                        </div>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl">
                          {stream.user?.avatarUrl || "🎮"}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-bold text-sm mb-1">
                            {stream.user?.username || "Streamer"}
                          </h3>
                          <p className="text-slate-400 text-xs">
                            @{(stream.user?.username || "streamer").toLowerCase()}
                          </p>
                        </div>
                      </div>

                      <p className="text-white text-sm mb-2">
                        {stream.title || "Sin título"}
                      </p>
                      <span className="px-2.5 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-xs font-medium">
                        {stream.category || "Sin categoría"}
                      </span>

                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => navigate(`/stream/${stream.id}`)}
                          className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold text-white text-sm"
                        >
                          Ver Stream
                        </button>
                        <button className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg">
                          <Heart className="w-5 h-5 text-slate-300" />
                        </button>
                        <button className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg">
                          <UserPlus className="w-5 h-5 text-slate-300" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CATEGORÍAS POPULARES */}
      <section className="py-16 bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Categorías Populares
              </h2>
              <p className="text-slate-400">Descubre los juegos más vistos</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayCategories.slice(0, 4).map((cat, i) => {
              const gradients = [
                "from-red-500 to-purple-500",
                "from-blue-500 to-cyan-500",
                "from-green-500 to-emerald-500",
                "from-orange-500 to-pink-500",
              ];
              const icons = ["🎯", "⚔️", "🟫", "🚗"];

              const viewerCount = safeNumber(cat.viewerCount);

              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="group relative cursor-pointer"
                >
                  <div
                    className={`absolute -inset-1 bg-gradient-to-r ${gradients[i]} opacity-0 group-hover:opacity-75 blur-xl transition-all rounded-2xl`}
                  />

                  <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/5">
                    <div className="relative aspect-[4/5]">
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${gradients[i]} opacity-80`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />

                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-8xl opacity-90">
                          {icons[i] || "🎮"}
                        </div>
                      </div>

                      <div className="absolute bottom-4 left-4 flex gap-2">
                        <div className="px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-lg flex items-center gap-2">
                          <Eye className="w-4 h-4 text-white" />
                          <span className="text-sm font-bold text-white">
                            {(viewerCount / 1000).toFixed(0)}K
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="text-white font-bold text-lg mb-2">
                        {cat.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm">
                          {safeLocale(viewerCount)} espectadores
                        </span>
                        <ArrowRight className="w-4 h-4 text-purple-400" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
