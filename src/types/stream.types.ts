export interface Stream {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl: string;
  viewerCount: number;
  isLive: boolean;
  startedAt?: Date;
  category: string;
  streamer: {
    id: string;
    username: string;
    avatarUrl?: string;
  };
}

export interface StreamMetadata {
  resolution: string;
  bitrate: number;
  fps: number;
}

export interface StreamStats {
  currentViewers: number;
  peakViewers: number;
  chatMessages: number;
  followersGained: number;
  subscriptionsGained: number;
}