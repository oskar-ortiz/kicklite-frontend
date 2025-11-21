
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { api } from "../../services/api/api.config";
import LiveChat from "../../components/stream/LiveChat";

import { safeLocale } from "../../utils/safeFormat";
import { viewerSocket } from "../../services/websocket/viewerSocket";

// Nueva interfaz para clips
interface Clip {
  id: string;
  title: string;
  url: string; // mp4
  streamer: {
    id: string;
    username: string;
    avatarUrl?: string;
  };
  views: number;
  createdAt?: string;
}

interface Stream {
  id: string;
  title: string;
  thumbnailUrl?: string;
  viewerCount?: number;
  isLive?: boolean;
  description?: string;

  streamer?: {
    id: string;
    username: string;
    avatarUrl?: string;
  };
}

export default function StreamPage() {
  const { id } = useParams();

  const [stream, setStream] = useState<Stream | null>(null);
  const [clip, setClip] = useState<Clip | null>(null);

  const [liveViewers, setLiveViewers] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================================================================
  // 🔥 Cargar datos → Auto-detecta si es stream o es clip
  // ================================================================
  useEffect(() => {
    const load = async () => {
      if (!id) {
        setError("ID inválido");
        setLoading(false);
        return;
      }

      try {
        // Intentar cargar como STREAM
        const s = await api.get(`/api/streams/${id}`).catch(() => null);

        if (s?.data) {
          setStream(s.data);
          setLoading(false);
          return;
        }

        // Intentar cargar como CLIP
        const c = await api.get(`/api/clips/${id}`).catch(() => null);

        if (c?.data) {
          setClip(c.data);
          setLoading(false);
          return;
        }

        setError("No se encontró contenido");
      } catch (err) {
        console.error("❌ Error cargando:", err);
        setError("No se pudo cargar el contenido");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  // ================================================================
  // 🔴 STREAM → conectar viewers real-time
  // ================================================================
  useEffect(() => {
    if (!id || !stream) return;

    let subscription: any = null;

    viewerSocket
      .connect()
      .then(() => {
        subscription = viewerSocket.subscribeToViewers(id, (count) => {
          setLiveViewers(count);
        });
      })
      .catch((err) => console.error("WS error:", err));

    return () => {
      subscription?.unsubscribe?.();
      viewerSocket.disconnect();
    };
  }, [id, stream]);

  // ================================================================
  // LOADING / ERROR
  // ================================================================
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-white mt-4">Cargando contenido...</p>
        </div>
      </div>
    );
  }

  if (error || (!stream && !clip)) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <a
            href="/"
            className="text-purple-400 underline hover:text-purple-300"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    );
  }

  // ================================================================
  // 🔥 SI ES CLIP (video mp4)
  // ================================================================
  if (clip) {
    return (
      <div className="min-h-screen bg-slate-950 pt-20">
        <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* VIDEO */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-white mb-4">
              {clip.title}
            </h1>

            <video
              controls
              src={clip.url}
              className="w-full rounded-xl border border-slate-800 shadow-xl bg-black"
            />

            {/* STREAMER INFO */}
            <div className="mt-6 flex items-center gap-4">
              <img
                src={
                  clip.streamer?.avatarUrl ||
                  "https://via.placeholder.com/64x64?text=Avatar"
                }
                alt={clip.streamer?.username}
                className="w-16 h-16 rounded-full border-2 border-purple-500"
              />
              <div>
                <p className="text-slate-400 text-sm">Clip subido por</p>
                <p className="text-white text-xl font-bold">
                  {clip.streamer?.username}
                </p>
              </div>
            </div>

            <div className="mt-4 text-slate-400">
              <span>{safeLocale(clip.views)} vistas</span>
            </div>
          </div>

          {/* CHAT (SOLO LECTURA PARA CLIPS) */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 text-white">
              <h2 className="text-lg font-bold mb-3">Comentarios</h2>
              <p className="text-slate-400 text-sm">
                (Los clips no tienen chat en vivo, solo los streams)
              </p>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // ================================================================
  // 🔴 STREAM EN VIVO / PRE-GO-LIVE
  // ================================================================
  const viewerCountToShow =
    liveViewers !== null && liveViewers >= 0
      ? liveViewers
      : stream?.viewerCount ?? 0;

  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* STREAM VIDEO */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold text-white mb-4">
            {stream?.title || "Stream sin título"}
          </h1>

          <img
            src={
              stream?.thumbnailUrl ||
              "https://via.placeholder.com/1280x720?text=Stream"
            }
            alt={stream?.title}
            className="w-full rounded-xl shadow-xl border border-slate-800"
          />

          {/* STREAMER INFO */}
          <div className="mt-6 flex items-center gap-4">
            <img
              src={
                stream?.streamer?.avatarUrl ||
                "https://via.placeholder.com/64x64?text=Avatar"
              }
              alt={stream?.streamer?.username}
              className="w-16 h-16 rounded-full border-2 border-purple-500"
            />

            <div>
              <p className="text-slate-400 text-sm">Streamer</p>
              <p className="text-white text-xl font-bold">
                {stream?.streamer?.username || "Usuario desconocido"}
              </p>
            </div>
          </div>

          {/* VIEWERS */}
          <div className="mt-4 text-slate-400">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              {safeLocale(viewerCountToShow)} espectadores
            </span>
          </div>

          <p className="text-slate-300 mt-6">
            {stream?.description || "Sin descripción"}
          </p>
        </div>

        {/* CHAT */}
        <div className="lg:col-span-1">
          <LiveChat streamId={id!} />
        </div>

      </div>
    </div>
  );
}
