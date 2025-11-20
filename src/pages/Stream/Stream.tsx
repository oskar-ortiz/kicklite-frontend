import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../services/api/api.config";
import { Stream } from "../../types/stream.types";

export default function StreamPage() {
  const { id } = useParams();
  const [stream, setStream] = useState<Stream | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStream = async () => {
      if (!id) {
        setError("ID de stream no válido");
        setLoading(false);
        return;
      }

      try {
        console.log('📡 Cargando stream:', id);
        // ✅ CORREGIDO: Era api.get`...` (template literal) 
        // Debe ser api.get('...')
        const res = await api.get(`/api/streams/${id}`);
        setStream(res.data);
        console.log('✅ Stream cargado:', res.data);
      } catch (err: any) {
        console.error('❌ Error cargando stream:', err.message);
        setError("No se pudo cargar el stream.");
      } finally {
        setLoading(false);
      }
    };

    loadStream();
  }, [id]);

  // ============================
  // 🔄 Estado: Loading
  // ============================
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando stream...</p>
        </div>
      </div>
    );
  }

  // ============================
  // ❌ Estado: Error
  // ============================
  if (error || !stream) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">
            {error || "Stream no encontrado"}
          </p>
          <a 
            href="/" 
            className="text-purple-400 hover:text-purple-300 underline"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    );
  }

  // ============================
  // ✅ Estado: Stream cargado
  // ============================
  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Título */}
        <h1 className="text-3xl font-bold text-white mb-4">
          {stream.title || 'Stream sin título'}
        </h1>

        {/* Thumbnail/Video */}
        <div className="mb-6">
          <img
            src={stream.thumbnailUrl || 'https://via.placeholder.com/1280x720?text=Stream'}
            alt={stream.title}
            className="w-full max-w-4xl mx-auto rounded-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/1280x720?text=Stream';
            }}
          />
        </div>

        {/* Descripción */}
        <p className="text-slate-300 mb-6">
          {stream.description || 'Sin descripción disponible'}
        </p>

        {/* Info del streamer */}
        <div className="mt-6 flex items-center gap-4">
          <img
            src={stream.streamer?.avatarUrl || 'https://via.placeholder.com/64x64?text=Avatar'}
            alt={stream.streamer?.username}
            className="w-16 h-16 rounded-full border-2 border-purple-500"
          />
          <div>
            <p className="text-slate-400 text-sm">Streamer</p>
            <p className="text-white text-xl font-bold">
              {stream.streamer?.username || 'Usuario desconocido'}
            </p>
          </div>
        </div>

        {/* Viewers */}
        {stream.viewerCount !== undefined && (
          <div className="mt-4 text-slate-400">
            <span className="inline-flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              {stream.viewerCount.toLocaleString()} espectadores
            </span>
          </div>
        )}
      </div>
    </div>
  );
}