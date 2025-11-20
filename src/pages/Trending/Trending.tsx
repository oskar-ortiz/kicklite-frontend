// src/pages/Trending/Trending.tsx
import { useEffect, useState } from "react";
import { Flame } from "lucide-react";
import {
  getLiveStreams,
  type Stream,
} from "../../services/api/streamService";
import { safeLocale } from "../../utils/safeFormat";

export default function TrendingPage() {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getLiveStreams();
        const sorted = [...(data || [])].sort(
          (a, b) => b.viewerCount - a.viewerCount
        );
        setStreams(sorted);
      } catch (err) {
        console.error("❌ Error cargando trending:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Flame className="w-6 h-6 text-orange-400" />
          <h1 className="text-3xl font-bold text-white">Trending Streams</h1>
        </div>

        {loading ? (
          <p className="text-slate-400">Cargando streams...</p>
        ) : streams.length === 0 ? (
          <p className="text-slate-400">
            No hay streams trending en este momento.
          </p>
        ) : (
          <div className="space-y-4">
            {streams.map((stream, index) => (
              <div
                key={stream.id}
                className="flex items-center gap-4 bg-slate-900 rounded-xl border border-white/10 p-4"
              >
                <div className="w-8 text-center text-lg font-bold text-orange-400">
                  #{index + 1}
                </div>

                <div className="w-32 h-20 rounded-md bg-slate-800 overflow-hidden">
                  {stream.thumbnailUrl ? (
                    <img
                      src={stream.thumbnailUrl}
                      alt={stream.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                      Sin thumbnail
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h2 className="text-white font-semibold text-sm">
                    {stream.title || "Sin título"}
                  </h2>
                  <p className="text-slate-400 text-xs">
                    {stream.user?.username || "Streamer"} •{" "}
                    {stream.category || "Sin categoría"}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-white font-semibold">
                    {safeLocale(stream.viewerCount)} viewers
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
