import { useEffect, useState } from "react";
import ClipCard, { ClipType } from "../../components/clips/ClipCard";
import { api } from "../../services/api/api.config";

export default function LivePage() {
  const [clips, setClips] = useState<ClipType[]>([]);

  useEffect(() => {
    api.get("/api/clips").then((res) => setClips(res.data || []));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 pt-24 px-6">
      <h1 className="text-white text-3xl font-bold mb-6">Explorar Clips</h1>

      {clips.length === 0 ? (
        <p className="text-slate-400">No hay clips disponibles.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {clips.map((clip) => (
            <ClipCard key={clip.id} clip={clip} onClick={() => {}} />
          ))}
        </div>
      )}
    </div>
  );
}
