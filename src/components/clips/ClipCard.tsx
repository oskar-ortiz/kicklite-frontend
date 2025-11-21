// src/components/clips/ClipCard.tsx
import { ClipType } from "../../types/clip.types";

interface ClipCardProps {
  clip: ClipType;
  onClick: () => void;
}

export default function ClipCard({ clip, onClick }: ClipCardProps) {
  return (
    <div
      className="cursor-pointer rounded-xl overflow-hidden bg-slate-900 border border-white/10 hover:border-purple-500 transition shadow-lg"
      onClick={onClick}
    >
      <img
        src={
          clip.thumbnailUrl ||
          `https://ui-avatars.com/api/?background=6d28d9&color=fff&name=${clip.title}`
        }
        className="w-full h-48 object-cover"
        alt={clip.title}
      />

      <div className="p-4 text-white">
        <h2 className="font-semibold text-lg truncate">{clip.title}</h2>

        {clip.streamer?.username && (
          <p className="text-sm text-slate-400 mt-1 truncate">
            @{clip.streamer.username}
          </p>
        )}

        <p className="text-xs text-slate-500 mt-2">
          {clip.views} vistas
        </p>
      </div>
    </div>
  );
}

export type { ClipType };
