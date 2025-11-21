// src/pages/Stream/Stream.tsx
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

import Hls from "hls.js";

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
  createdAt?: string;
}

interface Stream {
  id: string;
  title: string;
  thumbnailUrl?: string;
  viewerCount?: number;
  isLive?: boolean;
  description?: string;

  streamUrl?: string; // 👈 AÑADIDO (m3u8)

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

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // ================================================================
  // 🔥 Cargar datos → Detectar STREAM o CLIP
  // ================================================================
  useEffect(() => {
    const load = async () => {
      if (!id) {
        setError("ID inválido");
        setLoading(false);
        return;
      }

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

        setError("No se encontró contenido");
      } catch (err) {
        setError("No se pudo cargar el contenido");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  // ================================================================
  // 🔴 STREAM → HLS PLAYER
  // ================================================================
  useEffect(() => {
    if (!stream?.streamUrl || !videoRef.current) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(stream.streamUrl);
      hls.attachMedia(videoRef.current);

      return () => hls.destroy();
    } else if (
      videoRef.current.canPlayType("application/vnd.apple.mpegurl")
    ) {
      videoRef.current.src = stream.streamUrl;
    }
  }, [stream?.streamUrl]);

  // ================================================================
  // 🔴 STREAM → Viewers real-time
  // ================================================================
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

  // ================================================================
  // LOADING / ERROR
  // ================================================================
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-white">Cargando...</p>
      </div>
    );
  }

  if (error || (!stream && !clip)) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // ================================================================
  // 🔥 CLIP (MP4)
  // ================================================================
  if (clip) {
    return (
      <div className="min-h-screen bg-slate-950 pt-20">
        <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-white mb-4">
              {clip.title}
            </h1>

            <video
              controls
              src={clip.url}
              className="w-full rounded-xl bg-black border border-slate-800"
            />
          </div>

          <div className="lg:col-span-1">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
              <h2 className="text-lg text-white">Comentarios</h2>
              <p className="text-slate-400 text-sm">
                Los clips no tienen chat
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ================================================================
  // 🔥 STREAM EN VIVO (HLS + CHAT)
  // ================================================================
  const viewerCountToShow =
    liveViewers !== null ? liveViewers : stream?.viewerCount ?? 0;

  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* PLAYER */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold text-white mb-4">
            {stream?.title}
          </h1>

          <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-white/10">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              controls
            />
          </div>

          <p className="mt-4 text-slate-400">
            {safeLocale(viewerCountToShow)} espectadores
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
