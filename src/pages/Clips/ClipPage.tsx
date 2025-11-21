// src/pages/Clips/ClipPage.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ClipType } from "../../types/clip.types";
import { api } from "../../services/api/api.config";
import { safeLocale } from "../../utils/safeFormat";

export default function ClipPage() {
  const { id } = useParams();

  const [clip, setClip] = useState<ClipType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/api/clips/${id}`);
        setClip(res.data);
      } catch (err) {
        console.log("Error cargando clip:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-white">Cargando…</p>
      </div>
    );
  }

  if (!clip) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-red-400">Clip no encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-white text-3xl font-bold mb-6">{clip.title}</h1>

        <video
          src={clip.url}
          controls
          className="w-full rounded-xl bg-black border border-white/10 shadow-xl"
        />

        <div className="mt-6 flex items-center gap-4">
          <img
            src={
              clip.streamer?.avatarUrl ||
              "https://ui-avatars.com/api/?background=6d28d9&color=ffffff"
            }
            className="w-14 h-14 rounded-full border-2 border-purple-500"
          />

          <div>
            <p className="text-slate-300 text-sm">Subido por</p>
            <p className="text-white text-xl font-bold">
              {clip.streamer.username}
            </p>
          </div>
        </div>

        <p className="mt-4 text-slate-400">
          {safeLocale(clip.views)} vistas
        </p>
      </div>
    </div>
  );
}
