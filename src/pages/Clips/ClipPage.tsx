import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../services/api/api.config";
import { safeLocale } from "../../utils/safeFormat";

interface Clip {
  id: string;
  title: string;
  url: string;
  views: number;
  streamer: { username: string; avatarUrl?: string };
}

export default function ClipPage() {
  const { id } = useParams();
  const [clip, setClip] = useState<Clip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/api/clips/${id}`).then((res) => {
      setClip(res.data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <p className="text-white">Cargando...</p>;
  if (!clip) return <p className="text-red-500">Clip no encontrado</p>;

  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-white text-3xl font-bold mb-6">{clip.title}</h1>

        <video controls src={clip.url} className="w-full rounded-xl" />

        <div className="mt-4 flex gap-4">
          <img
            src={clip.streamer.avatarUrl}
            className="w-16 h-16 rounded-full border border-purple-500"
          />
          <div>
            <p className="text-slate-400 text-sm">Streamer</p>
            <p className="text-white font-bold text-xl">
              {clip.streamer.username}
            </p>
          </div>
        </div>

        <p className="text-slate-400 mt-3">{safeLocale(clip.views)} vistas</p>
      </div>
    </div>
  );
}
