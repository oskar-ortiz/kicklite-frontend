// src/pages/Clips/ClipsPage.tsx
import { useEffect, useState } from "react";
import ClipCard from "../../components/clips/ClipCard";
import { ClipType } from "../../types/clip.types";
import { getAllClips } from "../../services/api/clipService";
import { useNavigate } from "react-router-dom";

export default function ClipsPage() {
  const [clips, setClips] = useState<ClipType[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllClips();
        setClips(data || []);
      } catch (err) {
        console.log("Error cargando clips:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 pt-20 px-6">
      <h1 className="text-white text-3xl font-bold mb-6">Clips Populares</h1>

      {loading ? (
        <p className="text-slate-400">Cargando clips…</p>
      ) : clips.length === 0 ? (
        <p className="text-slate-400">No hay clips todavía.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {clips.map((clip) => (
            <ClipCard
              key={clip.id}
              clip={clip}
              onClick={() => navigate(`/clip/${clip.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
