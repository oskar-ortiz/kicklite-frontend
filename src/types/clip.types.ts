// src/types/clip.types.ts

export interface ClipType {
  id: string;
  title: string;
  url: string;              // MP4 real
  thumbnailUrl?: string;

  streamer: {
    id: string;
    username: string;
    avatarUrl?: string;
  };

  views: number;
  createdAt?: string;
}
