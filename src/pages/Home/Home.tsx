import React from 'react';
import StreamCard from '../../components/home/StreamCard';
import CategoryGrid from '../../components/home/CategoryGrid';
import FeaturedStream from '../../components/home/FeaturedStream';
import { useAuth } from '../../context/AuthContext';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Featured Stream Section */}
      <section className="mb-12">
        <FeaturedStream />
      </section>

      {/* Live Channels Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Live Channels</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <StreamCard
            stream={{
              id: '1',
              title: 'Welcome Stream',
              thumbnailUrl: '/placeholder.jpg',
              viewerCount: 1000,
              isLive: true,
              category: 'Just Chatting',
              streamer: {
                id: '1',
                username: 'Streamer1',
                avatarUrl: '/avatar.jpg'
              }
            }}
          />
        </div>
      </section>

      {/* Categories Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Browse Categories</h2>
        <CategoryGrid />
      </section>

      {/* Recommended Channels */}
      {isAuthenticated && (
        <section>
          <h2 className="text-2xl font-bold mb-6">Recommended for You</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* We'll map through recommended streams here */}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;