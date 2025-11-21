// src/pages/Stream/Stream.tsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../services/api/api.config";
import { Stream } from "../../types/stream.types";

import LiveChat from "../../components/stream/LiveChat";
import { safeLocale } from "../../utils/safeFormat";

export default function StreamPage() {
  const { id } = useParams();
  const [stream, setStream] = useState<Stream | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setError("ID de stream no válido");
        setLoading(false);
        return;
      }

      try {
        const res = await api.get(`/api/streams/${id}`);
        setStream(res.data);
      } catch (err: any) {
        console.error("❌ Error cargando stream:", err);
        setError("No se pudo cargar el stream.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-white mt-4">Cargando stream...</p>
        </div>
      </div>
    );
  }

  if (error || !stream) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error || "Stream no encontrado"}</p>
          <a href="/" className="text-purple-400 underline hover:text-purple-300">
            Volver al inicio
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ====================== */}
        {/*   VIDEO + INFO         */}
        {/* ====================== */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold text-white mb-4">
            {stream.title || "Stream sin título"}
          </h1>

          <img
            src={stream.thumbnailUrl || "https://via.placeholder.com/1280x720?text=Stream"}
            alt={stream.title}
            className="w-full rounded-xl shadow-xl border border-slate-800"
          />

          <div className="mt-6 flex items-center gap-4">
            <img
              src={stream.streamer?.avatarUrl || "https://via.placeholder.com/64x64?text=Avatar"}
              alt={stream.streamer?.username}
              className="w-16 h-16 rounded-full border-2 border-purple-500"
            />
            <div>
              <p className="text-slate-400 text-sm">Streamer</p>
              <p className="text-white text-xl font-bold">
                {stream.streamer?.username || "Usuario desconocido"}
              </p>
            </div>
          </div>

          {stream.viewerCount !== undefined && (
            <div className="mt-4 text-slate-400">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                {safeLocale(stream.viewerCount)} espectadores
              </span>
            </div>
          )}

          <p className="text-slate-300 mt-6">{stream.description || "Sin descripción"}</p>
        </div>

        {/* ====================== */}
        {/*         CHAT           */}
        {/* ====================== */}
        <div className="lg:col-span-1">
          <LiveChat streamId={id!} />
        </div>

      </div>
    </div>
  );
}
