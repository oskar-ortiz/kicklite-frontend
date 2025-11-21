// src/pages/Home/Home.tsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Play, Sparkles, Users, Radio } from "lucide-react";
import { useNavigate } from "react-router-dom";

import HlsPlayer from "../../components/player/HlsPlayer";
import { useAuth } from "../../context/AuthContext";

import { api, API_ENDPOINTS } from "../../services/api/api.config";

import { getAllClips } from "../../services/api/clipService";
import ClipCard, { ClipType } from "../../components/clips/ClipCard";

// =====================
// MOCK para stream en vivo
// Tu backend luego lo reemplaza
// =====================

interface LiveStreamMock {
  id: string;
  username: string;
  title: string;
  streamUrl: string; // URL HLS (fake)
  viewerCount: number;
  thumbnailUrl?: string;
}

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Clips
  const [clips, setClips] = useState<ClipType[]>([]);
  const [loadingClips, setLoadingClips] = useState(true);

  // Stream en vivo (mock hasta que tu backend lo dé real)
  const [liveStream, setLiveStream] = useState<LiveStreamMock | null>(null);

  const [startingStream, setStartingStream] = useState(false);

  // ===========================
  // 1. Cargar Clips
  // ===========================
  useEffect(() => {
    const loadClips = async () => {
      try {
        const data: any = await getAllClips();
        setClips(data || []);
      } catch (err) {
        console.error("Error cargando clips:", err);
      } finally {
        setLoadingClips(false);
      }
    };

    loadClips();
  }, []);

  // ===========================
  // 2. Cargar Stream en Vivo (fake temporal)
  // ===========================
  useEffect(() => {
    // Tu compañero sustituirá esto por:
    // const stream = await api.get("/api/streams/live");
    setLiveStream({
      id: "stream123",
      username: "Oskkiii",
      title: "EN VIVO AHORA MISMO",
      streamUrl:
        "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8", // DEMO HLS
      viewerCount: 21,
      thumbnailUrl:
        "https://i.pinimg.com/originals/8d/a0/6a/8da06af7ce4a15a43b44e07039e89165.jpg",
    });
  }, []);

  // ===========================
  // 3. Handler para iniciar stream
  // ===========================
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

  // ===========================
  // 4. UI
  // ===========================
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* =============================================== */}
      {/* HERO + PREVIEW DEL STREAM */}
      {/* =============================================== */}
      <section className="pt-20 container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* ==== TEXTO ==== */}
          <div className="flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-4 py-2 rounded-full mb-4 w-fit">
              <Sparkles className="w-4 h-4 text-purple-300" />
              <span className="text-sm text-purple-300">
                #1 Plataforma para Streamers
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
              <span className="text-white">streamora</span>
              <span className="text-white/40">.space</span>
            </h1>

            <p className="text-lg text-slate-300 mb-8">
              Comparte tus mejores momentos o transmite en vivo a tu comunidad.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleStartStreaming}
                disabled={startingStream}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-semibold"
              >
                {startingStream ? "Iniciando..." : "Comenzar Stream"}
              </button>

              <button
                onClick={() => navigate("/live")}
                className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl"
              >
                Ver Clips
              </button>
            </div>

            <div className="mt-8 flex gap-8">
              <div>
                <p className="text-3xl font-bold">{clips.length}</p>
                <p className="text-slate-400 text-sm">Clips subidos</p>
              </div>
              <div>
                <p className="text-3xl font-bold">{liveStream ? 1 : 0}</p>
                <p className="text-slate-400 text-sm">Streams activos</p>
              </div>
            </div>
          </div>

          {/* ==== PREVIEW DEL STREAM ==== */}
          <div className="relative bg-slate-900 border border-white/10 rounded-xl overflow-hidden shadow-xl">
            {liveStream ? (
              <>

                {/* Player silencioso estilo Kick */}
                <HlsPlayer
                  src={liveStream.streamUrl}
                  autoPlay={true}
                  muted={true}
                  controls={false}
                  className="w-full h-full aspect-video object-cover"
                />

                {/* Overlay */}
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 px-3 py-1 rounded-lg">
                  <Radio className="w-3 h-3 animate-pulse" />
                  <span className="text-xs font-semibold">EN VIVO</span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <p className="text-lg font-bold">{liveStream.title}</p>
                  <p className="text-sm text-slate-300">@{liveStream.username}</p>
                </div>

              </>
            ) : (
              <div className="aspect-video flex items-center justify-center bg-slate-800 text-slate-400">
                No hay streams activos
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =============================================== */}
      {/* GRID DE CLIPS */}
      {/* =============================================== */}
      <section className="py-20 container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6">Clips del Canal</h2>

        {loadingClips ? (
          <p className="text-slate-400">Cargando clips...</p>
        ) : clips.length === 0 ? (
          <p className="text-slate-400">No hay clips todavía.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {clips.slice(0, 6).map((clip) => (
              <ClipCard
                key={clip.id}
                clip={clip}
                onClick={() => navigate(`/clip/${clip.id}`)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
