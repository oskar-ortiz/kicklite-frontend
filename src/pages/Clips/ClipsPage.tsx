import { useEffect, useState } from "react";
import { getAllClips } from "../../services/api/clipService";
import ClipCard from "../../components/clips/ClipCard";
import { useNavigate } from "react-router-dom";
import { ClipType } from "../../components/clips/ClipCard";

export default function ClipsPage() {
  const [clips, setClips] = useState<ClipType[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getAllClips().then((data) => {
      setClips(data || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">Clips</h1>

        {loading ? (
          <p className="text-slate-400">Cargando clips...</p>
        ) : clips.length === 0 ? (
          <p className="text-slate-400">No hay clips todavía.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    </div>
  );
}
