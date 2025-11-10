import React from 'react';
import { Stream } from '../../types/stream.types';
import { formatViewerCount } from '../../utils/formatters';

interface FeaturedStreamProps {
  stream?: Stream;
}

const FeaturedStream: React.FC<FeaturedStreamProps> = ({ stream }) => {
  // Placeholder data if no stream is provided
  const defaultStream: Stream = {
    id: 'featured-1',
    title: 'Welcome to KickLite!',
    description: 'Check out our featured content and start streaming today.',
    thumbnailUrl: '/assets/images/featured-placeholder.jpg',
    viewerCount: 0,
    isLive: false,
    category: 'Featured',
    streamer: {
      id: 'system',
      username: 'KickLite',
      avatarUrl: '/assets/images/kicklite-logo.png'
    }
  };

  const displayStream = stream || defaultStream;

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden">
      <img
        src={displayStream.thumbnailUrl}
        alt={displayStream.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        {displayStream.isLive && (
          <span className="inline-block bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
            LIVE
          </span>
        )}
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          {displayStream.title}
        </h1>
        <div className="flex items-center gap-4 text-white">
          <div className="flex items-center gap-2">
            <img
              src={displayStream.streamer.avatarUrl}
              alt={displayStream.streamer.username}
              className="w-10 h-10 rounded-full"
            />
            <span className="font-medium">{displayStream.streamer.username}</span>
          </div>
          <span className="text-gray-300">
            {formatViewerCount(displayStream.viewerCount)} viewers
          </span>
        </div>
        {displayStream.description && (
          <p className="mt-4 text-gray-200 max-w-2xl">
            {displayStream.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default FeaturedStream;