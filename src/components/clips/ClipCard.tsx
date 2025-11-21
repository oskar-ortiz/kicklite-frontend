// src/components/clips/ClipCard.tsx
import { motion } from "framer-motion";
import { Play, Eye, Heart } from "lucide-react";

export interface ClipType {
  id: string;
  title: string;
  videoUrl: string;
  views: number;
  user: {
    username: string;
    avatarUrl?: string;
  };
}

interface Props {
  clip: ClipType;
  onClick: () => void;
}

export default function ClipCard({ clip, onClick }: Props) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      onClick={onClick}
      className="cursor-pointer bg-slate-900 border border-white/10 rounded-xl overflow-hidden shadow-lg hover:shadow-purple-500/20 transition-all"
    >
      {/* VIDEO + OVERLAY */}
      <div className="relative aspect-video overflow-hidden">
        <video
          src={clip.videoUrl}
          className="w-full h-full object-cover transition-all duration-300"
          muted
          preload="metadata"
          onMouseEnter={(e) => (e.currentTarget.playbackRate = 1)}
          onMouseOut={(e) => e.currentTarget.pause()}
          onLoadedMetadata={(e) => e.currentTarget.pause()}
        />

        {/* BOTÓN PLAY AL HOVER */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition">
          <div className="w-16 h-16 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Play className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* VISTAS */}
        <div className="absolute top-3 right-3 flex items-center gap-2 bg-black/60 px-3 py-1 rounded-lg">
          <Eye className="w-4 h-4 text-white" />
          <span className="text-white text-xs">{clip.views}</span>
        </div>
      </div>

      {/* INFO DEL CLIP */}
      <div className="p-4">

        {/* TÍTULO */}
        <h3 className="text-white font-semibold text-sm truncate">
          {clip.title}
        </h3>

        {/* USUARIO */}
        <div className="flex items-center gap-2 mt-2">
          <img
            src={
              clip.user.avatarUrl ||
              "https://ui-avatars.com/api/?name=User&background=6b21a8&color=fff"
            }
            alt="avatar"
            className="w-8 h-8 rounded-full object-cover border border-white/10"
          />
          <span className="text-slate-400 text-xs">@{clip.user.username}</span>
        </div>

        {/* BOTONES */}
        <div className="flex items-center justify-between mt-3">
          <button
            className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition"
          >
            <Heart className="w-4 h-4 text-pink-400" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
