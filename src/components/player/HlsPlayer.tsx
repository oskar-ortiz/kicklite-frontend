// src/components/player/HlsPlayer.tsx
import { useEffect, useRef } from "react";
import Hls from "hls.js";

interface HlsPlayerProps {
  src: string;
  autoPlay?: boolean;
  muted?: boolean;
  controls?: boolean;
  poster?: string;
  className?: string;
}

export default function HlsPlayer({
  src,
  autoPlay = true,
  muted = false,
  controls = true,
  poster,
  className = "",
}: HlsPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    // Si el navegador soporta HLS nativo
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    } else if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);

      return () => {
        hls.destroy();
      };
    } else {
      console.error("HLS no soportado en este navegador.");
    }
  }, [src]);

  return (
    <video
      ref={videoRef}
      autoPlay={autoPlay}
      muted={muted}
      controls={controls}
      poster={poster}
      playsInline
      className={className}
    />
  );
}
