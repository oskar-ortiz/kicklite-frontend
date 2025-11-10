import React from 'react';
import StreamCard from '../../components/home/StreamCard';
import CategoryGrid from '../../components/home/CategoryGrid';
import FeaturedStream from '../../components/home/FeaturedStream';
import LiveChat from '../../components/stream/LiveChat';
import { useAuth } from '../../context/AuthContext';

interface Stream {
  id: string;
  title: string;
  thumbnailUrl: string;
  viewerCount: number;
  isLive: boolean;
  category: string;
  streamer: {
    id: string;
    username: string;
    avatarUrl: string;
  };
}

const sampleStreams: Stream[] = [
  {
    id: '1',
    title: 'Late Night Gaming Session 🎮',
    thumbnailUrl: '/images/thumbnails/stream1.jpg',
    viewerCount: 1543,
    isLive: true,
    category: 'League of Legends',
    streamer: {
      id: '1',
      username: 'ProGamer',
      avatarUrl: '/images/avatars/user1.jpg'
    }
  },
  {
    id: '2',
    title: 'Ranked Matches with Viewers!',
    thumbnailUrl: '/images/thumbnails/stream2.jpg',
    viewerCount: 892,
    isLive: true,
    category: 'Valorant',
    streamer: {
      id: '2',
      username: 'AimQueen',
      avatarUrl: '/images/avatars/user2.jpg'
    }
  },
  {
    id: '3',
    title: 'Just Chatting with Community',
    thumbnailUrl: '/images/thumbnails/stream3.jpg',
    viewerCount: 2103,
    isLive: true,
    category: 'Just Chatting',
    streamer: {
      id: '3',
      username: 'StreamerPro',
      avatarUrl: '/images/avatars/user3.jpg'
    }
  },
  {
    id: '4',
    title: 'Building a Game in Unity!',
    thumbnailUrl: '/images/thumbnails/stream4.jpg',
    viewerCount: 456,
    isLive: true,
    category: 'Game Development',
    streamer: {
      id: '4',
      username: 'CodeMaster',
      avatarUrl: '/images/avatars/user4.jpg'
    }
  }
];

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Featured Stream with Chat */}
      <section className="mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <FeaturedStream />
          </div>
          <div className="hidden lg:block">
            <LiveChat />
          </div>
        </div>
      </section>

      {/* Live Channels Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-white">Live Channels</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sampleStreams.map((stream) => (
            <StreamCard key={stream.id} stream={stream} />
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-white">Browse Categories</h2>
        <CategoryGrid />
      </section>

      {/* Recommended Channels */}
      {isAuthenticated && (
        <section>
          <h2 className="text-2xl font-bold mb-6 text-white">Recommended for You</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sampleStreams.slice(0, 2).map((stream) => (
              <StreamCard key={stream.id} stream={stream} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;