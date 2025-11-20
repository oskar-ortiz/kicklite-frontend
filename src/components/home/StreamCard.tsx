import React from 'react';
import { motion } from 'framer-motion';
import { Stream } from '../../types/stream.types';
import { formatViewerCount } from '../../utils/formatters';

interface StreamCardProps {
  stream: Stream;
  onClick?: () => void;
}

const StreamCard: React.FC<StreamCardProps> = ({ stream, onClick }) => {
  // ✅ Validación temprana
  if (!stream) {
    console.warn("⚠️ StreamCard recibió un stream undefined");
    return null;
  }

  // ============================
  // 🛡 Datos protegidos con valores por defecto
  // ============================
  const thumbnail =
    stream.thumbnailUrl ||
    'https://via.placeholder.com/640x360?text=Stream';
  
  const title = stream.title || 'Untitled stream';
  const category = stream.category || 'Uncategorized';
  
  const streamerUsername =
    stream.streamer?.username || 'Unknown user';
  
  const avatar =
    stream.streamer?.avatarUrl ||
    'https://via.placeholder.com/40x40?text=Avatar';
  
  // ✅ Usar formatViewerCount que ya maneja undefined
  const viewerCount = formatViewerCount(stream.viewerCount);
  
  const isLive = Boolean(stream.isLive);

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      className="bg-slate-800 rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-xl"
      onClick={onClick}
    >
      {/* ============================
          🖼 Thumbnail
      ============================ */}
      <div className="relative overflow-hidden">
        <img
          src={thumbnail}
          alt={title}
          className="w-full aspect-video object-cover transition-transform duration-300 hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/640x360?text=Stream';
          }}
        />
        
        {/* 🔴 LIVE badge */}
        {isLive && (
          <motion.span
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 text-xs rounded font-bold"
          >
            LIVE
          </motion.span>
        )}
        
        {/* 👁 Viewers */}
        <span className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 text-xs rounded">
          {viewerCount} viewers
        </span>
      </div>

      {/* ============================
          👤 Streamer info
      ============================ */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <img
            src={avatar}
            alt={streamerUsername}
            className="w-10 h-10 rounded-full flex-shrink-0 border border-purple-500"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/40x40?text=Avatar';
            }}
          />
          
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-white line-clamp-2 text-sm">
              {title}
            </h3>
            <p className="text-gray-400 text-xs truncate">
              {streamerUsername}
            </p>
            <p className="text-gray-500 text-xs truncate">
              {category}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StreamCard;