// src/pages/Live/Live.tsx
import { useEffect, useState } from "react";
import { Eye, Radio, Play } from "lucide-react";
import {
  getLiveStreams,
  type Stream,
} from "../../services/api/streamService";
import { safeLocale } from "../../utils/safeFormat";

export default function LivePage() {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getLiveStreams();
        setStreams(data || []);
      } catch (err) {
        console.error("❌ Error cargando streams:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">Canales en Vivo</h1>

        {loading ? (
          <p className="text-slate-400">Cargando streams...</p>
        ) : streams.length === 0 ? (
          <p className="text-slate-400">
            No hay streams en vivo en este momento.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {streams.map((stream) => (
              <div
                key={stream.id}
                className="bg-slate-900 rounded-xl border border-white/10 overflow-hidden"
              >
                <div className="relative aspect-video bg-slate-800">
                  {stream.thumbnailUrl ? (
                    <img
                      src={stream.thumbnailUrl}
                      alt={stream.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">
                      Sin thumbnail
                    </div>
                  )}

                  <div className="absolute top-3 left-3 px-3 py-1.5 bg-red-500 rounded-lg flex items-center gap-2">
                    <Radio className="w-3 h-3 text-white" />
                    <span className="text-xs font-bold text-white">
                      EN VIVO
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 px-3 py-1.5 bg-black/60 rounded-lg flex items-center gap-2">
                    <Eye className="w-3 h-3 text-white" />
                    <span className="text-xs text-white font-semibold">
                      {safeLocale(stream.viewerCount)}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h2 className="text-white font-semibold text-sm mb-1">
                    {stream.title || "Sin título"}
                  </h2>

                  <p className="text-slate-400 text-xs mb-2">
                    {stream.category || "Sin categoría"}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs">
                        {stream.user?.username?.[0]?.toUpperCase() || "S"}
                      </div>
                      <span className="text-xs text-white">
                        {stream.user?.username || "Streamer"}
                      </span>
                    </div>

                    <button className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-600 rounded-lg text-xs text-white">
                      <Play className="w-3 h-3" />
                      Ver
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
