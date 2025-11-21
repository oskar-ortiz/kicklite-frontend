import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getClipsByUser } from "../../services/api/clipService";
import ClipCard, { ClipType } from "../../components/clips/ClipCard";

export default function MyClips() {
  const { user } = useAuth();
  const [clips, setClips] = useState<ClipType[]>([]);

  useEffect(() => {
    if (!user) return;
    getClipsByUser(user.id).then(setClips);
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">Mis Clips</h1>

        {clips.length === 0 ? (
          <p className="text-slate-400">No has subido clips todavía.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clips.map((clip) => (
              <ClipCard key={clip.id} clip={clip} onClick={() => {}} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
