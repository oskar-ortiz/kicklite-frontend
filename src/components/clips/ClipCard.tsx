// ===============================================
// 🔥 CLIP CARD COMPLETA + EXPORT ClipType
// ===============================================

import { motion } from "framer-motion";
import { Play, Heart, Eye } from "lucide-react";

// 🔥 ESTE TIPO ES NECESARIO PARA TODOS TUS ERRORES
export interface ClipType {
  id: string;
  title: string;
  views: number;
  url?: string;
  videoUrl?: string;
  user?: { username: string; avatarUrl?: string };
  streamer?: { username: string; avatarUrl?: string };
}

interface ClipCardProps {
  clip: ClipType;
  onClick?: () => void;
}

export default function ClipCard({ clip, onClick }: ClipCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-slate-900 rounded-xl border border-white/10 overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-video">
        <video
          src={clip.videoUrl || clip.url}
          className="w-full h-full object-cover"
          muted
          preload="metadata"
        />

        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition">
          <div className="w-16 h-16 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Play className="w-10 h-10 text-white" />
          </div>
        </div>

        <div className="absolute top-2 right-2 flex items-center gap-2 bg-black/60 px-3 py-1 rounded-lg">
          <Eye className="w-4 h-4 text-white" />
          <span className="text-white text-xs">{clip.views}</span>
        </div>
      </div>

      <div className="p-3">
        <h3 className="text-white font-semibold text-sm truncate">
          {clip.title}
        </h3>

        <p className="text-slate-400 text-xs">
          @{clip.user?.username || clip.streamer?.username || "user"}
        </p>

        <div className="flex items-center gap-3 mt-2">
          <button className="p-2 bg-white/5 rounded-lg border border-white/10">
            <Heart className="w-4 h-4 text-pink-400" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
