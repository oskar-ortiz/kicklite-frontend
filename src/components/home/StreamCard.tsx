import React from 'react';
import { Stream } from '../../types/stream.types';
import { formatViewerCount } from '../../utils/formatters';

interface StreamCardProps {
  stream: Stream;
  onClick?: () => void;
}

const StreamCard: React.FC<StreamCardProps> = ({ stream, onClick }) => {
  return (
    <div
      className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-105"
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={stream.thumbnailUrl}
          alt={stream.title}
          className="w-full aspect-video object-cover"
        />
        {stream.isLive && (
          <span className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 text-xs rounded">
            LIVE
          </span>
        )}
        <span className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 text-sm rounded">
          {formatViewerCount(stream.viewerCount)} viewers
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <img
            src={stream.streamer.avatarUrl}
            alt={stream.streamer.username}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h3 className="font-medium text-white line-clamp-1">{stream.title}</h3>
            <p className="text-gray-400 text-sm">{stream.streamer.username}</p>
            <p className="text-gray-400 text-sm">{stream.category}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamCard;