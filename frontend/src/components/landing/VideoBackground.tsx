import { useEffect, useRef, useState } from 'react';

interface VideoBackgroundProps {
  src: string;
  poster?: string;
  className?: string;
  /** Overlay opacity (0-1) */
  overlayOpacity?: number;
  /** Overlay color */
  overlayColor?: string;
  /** Whether to loop */
  loop?: boolean;
  /** Whether to mute (required for autoplay) */
  muted?: boolean;
  /** Playback rate */
  playbackRate?: number;
}

export default function VideoBackground({
  src,
  poster,
  className = '',
  overlayOpacity = 0.4,
  overlayColor = '#0c0a08',
  loop = true,
  muted = true,
  playbackRate = 1,
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Set video properties
    video.loop = loop;
    video.muted = muted;
    video.playbackRate = playbackRate;
    video.playsInline = true;

    // Try to play
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Autoplay blocked, show poster
          setIsPlaying(false);
        });
    }

    // Handle visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        video.pause();
      } else if (isPlaying) {
        video.play().catch(() => {});
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      video.pause();
    };
  }, [loop, muted, playbackRate, isPlaying]);

  if (!isPlaying) {
    return (
      <div
        className={`absolute inset-0 -z-10 ${className}`}
        style={{
          backgroundImage: poster ? `url(${poster})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: isPlaying ? 1 : 0.5,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: overlayColor,
            opacity: overlayOpacity,
          }}
        />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="absolute inset-0 h-full w-full object-cover -z-10"
        playsInline
        disablePictureInPicture
        preload="metadata"
      />
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundColor: overlayColor,
          opacity: overlayOpacity,
        }}
      />
    </div>
  );
}