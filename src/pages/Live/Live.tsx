// src/pages/Live/Live.tsx
import { useEffect, useState } from "react";
import { api } from "../../services/api/api.config";
import ClipCard from "../../components/clips/ClipCard";
import { ClipType } from "../../types/clip.types";
import { useNavigate } from "react-router-dom";

export default function LivePage() {
  const [streams, setStreams] = useState<any[]>([]);
  const [clips, setClips] = useState<ClipType[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const s = await api.get("/api/streams");
        setStreams(s.data || []);

        const c = await api.get("/api/clips");
        setClips(c.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 pt-20 px-6">
      <h1 className="text-white text-3xl font-bold mb-6">En Vivo</h1>

      {loading ? (
        <p className="text-slate-400">Cargando…</p>
      ) : (
        <>
          {/* STREAMS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {streams.map((s) => (
              <div
                key={s.id}
                className="rounded-xl overflow-hidden cursor-pointer bg-slate-900 border border-white/10 hover:border-purple-500 transition"
                onClick={() => navigate(`/stream/${s.id}`)}
              >
                <img
                  src={
                    s.thumbnailUrl ||
                    "https://via.placeholder.com/300x200?text=En+Vivo"
                  }
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 text-white">
                  <h2 className="font-semibold text-lg">{s.title}</h2>
                  <p className="text-sm text-slate-400">@{s.user.username}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CLIPS */}
          <h2 className="text-white text-2xl font-bold mb-3">Clips</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {clips.map((clip) => (
              <ClipCard
                key={clip.id}
                clip={clip}
                onClick={() => navigate(`/clip/${clip.id}`)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
