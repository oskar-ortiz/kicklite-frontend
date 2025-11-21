// src/pages/Stream/Stream.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { api } from "../../services/api/api.config";
import LiveChat from "../../components/stream/LiveChat";

import { safeLocale } from "../../utils/safeFormat";
import { viewerSocket } from "../../services/websocket/viewerSocket";

interface Clip {
  id: string;
  title: string;
  url: string;
  streamer: {
    id: string;
    username: string;
    avatarUrl?: string;
  };
  views: number;
}

interface Stream {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  viewerCount?: number;
  isLive?: boolean;

  // Si el backend manda streamUrl = video de stream (mp4)
  streamUrl?: string;

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

  // ============================================================
  // Cargar contenido automáticamente
  // ============================================================
  useEffect(() => {
    const load = async () => {
      try {
        const s = await api.get(`/api/streams/${id}`).catch(() => null);
        if (s?.data) {
          setStream(s.data);
          setLoading(false);
          return;
        }

        const c = await api.get(`/api/clips/${id}`).catch(() => null);
        if (c?.data) {
          setClip(c.data);
          setLoading(false);
          return;
        }

        setError("No se encontró contenido.");
      } catch (err) {
        console.error(err);
        setError("Error al cargar contenido.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  // ============================================================
  // Viewers realtime (solo stream)
  // ============================================================
  useEffect(() => {
    if (!id || !stream) return;

    let subscription: any = null;

    viewerSocket.connect().then(() => {
      subscription = viewerSocket.subscribeToViewers(id, (count) => {
        setLiveViewers(count);
      });
    });

    return () => {
      subscription?.unsubscribe?.();
      viewerSocket.disconnect();
    };
  }, [id, stream]);

  // ============================================================
  // LOADING / ERROR
  // ============================================================
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-white">Cargando contenido…</p>
      </div>
    );
  }

  if (error || (!stream && !clip)) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-red-400 text-xl">{error}</p>
      </div>
    );
  }

  // ============================================================
  //  🔥 CLIP (VIDEO MP4)
  // ============================================================
  if (clip) {
    return (
      <div className="min-h-screen bg-slate-950 pt-20">
        <div className="container mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* VIDEO */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-white mb-4">{clip.title}</h1>

            <video
              src={clip.url}
              controls
              className="w-full rounded-xl border border-white/10 bg-black shadow-xl"
            />

            {/* INFO */}
            <div className="mt-6 flex items-center gap-4">
              <img
                src={
                  clip.streamer?.avatarUrl ||
                  "https://ui-avatars.com/api/?background=6d28d9&color=fff&name=*"
                }
                className="w-16 h-16 rounded-full border-2 border-purple-600"
              />

              <div>
                <p className="text-slate-400 text-sm">Subido por</p>
                <p className="text-white text-xl font-bold">
                  {clip.streamer?.username}
                </p>
              </div>
            </div>

            <p className="mt-4 text-slate-400">
              {safeLocale(clip.views)} vistas
            </p>
          </div>

          {/* CHAT DISABLED */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900 border border-white/10 rounded-xl p-6">
              <h2 className="text-white text-lg font-bold mb-2">Comentarios</h2>
              <p className="text-slate-400 text-sm">
                Los clips no tienen chat en vivo.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  //  🔥 STREAM EN VIVO
  // ============================================================
  const viewerCountShow =
    liveViewers !== null ? liveViewers : stream?.viewerCount ?? 0;

  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      <div className="container mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* VIDEO PLAYER */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold text-white mb-4">
            {stream?.title}
          </h1>

          <div className="relative aspect-video bg-black rounded-xl border border-white/10 overflow-hidden shadow-xl">
            {stream?.streamUrl ? (
              <video
                src={stream.streamUrl}
                className="w-full h-full object-cover"
                controls
                autoPlay
              />
            ) : (
              <img
                src={
                  stream?.thumbnailUrl ||
                  "https://via.placeholder.com/1280x720?text=Esperando+stream"
                }
                className="w-full h-full object-cover opacity-80"
              />
            )}
          </div>

          <p className="mt-4 text-slate-400">
            🔴 {safeLocale(viewerCountShow)} espectadores
          </p>

          <p className="mt-4 text-slate-300">
            {stream?.description || "Sin descripción."}
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
