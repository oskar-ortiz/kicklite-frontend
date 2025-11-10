import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import StreamCard from './StreamCard';

const mockStream = {
  id: '1',
  title: 'Test Stream',
  thumbnailUrl: 'https://example.com/thumbnail.jpg',
  isLive: true,
  viewerCount: 1500,
  category: 'Gaming',
  streamer: {
    id: '1',
    username: 'testStreamer',
    avatarUrl: 'https://example.com/avatar.jpg'
  }
};

describe('StreamCard', () => {
  it('renders stream information correctly', () => {
    render(<StreamCard stream={mockStream} />);

    // Check if title is rendered
    expect(screen.getByText(mockStream.title)).toBeInTheDocument();
    
    // Check if streamer username is rendered
    expect(screen.getByText(mockStream.streamer.username)).toBeInTheDocument();
    
    // Check if category is rendered
    expect(screen.getByText(mockStream.category)).toBeInTheDocument();
    
    // Check if LIVE badge is rendered
    expect(screen.getByText('LIVE')).toBeInTheDocument();
    
    // Check if viewer count is rendered (using the formatter)
    expect(screen.getByText('1.5K viewers')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<StreamCard stream={mockStream} onClick={handleClick} />);

    const card = screen.getByRole('img', { name: mockStream.title });
    fireEvent.click(card.parentElement?.parentElement as HTMLElement);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not show LIVE badge when stream is offline', () => {
    const offlineStream = { ...mockStream, isLive: false };
    render(<StreamCard stream={offlineStream} />);

    expect(screen.queryByText('LIVE')).not.toBeInTheDocument();
  });

  it('renders images with correct attributes', () => {
    render(<StreamCard stream={mockStream} />);

    // Check thumbnail
    const thumbnail = screen.getByRole('img', { name: mockStream.title });
    expect(thumbnail).toHaveAttribute('src', mockStream.thumbnailUrl);
    expect(thumbnail).toHaveAttribute('alt', mockStream.title);

    // Check avatar
    const avatar = screen.getByRole('img', { name: mockStream.streamer.username });
    expect(avatar).toHaveAttribute('src', mockStream.streamer.avatarUrl);
    expect(avatar).toHaveAttribute('alt', mockStream.streamer.username);
  });
});