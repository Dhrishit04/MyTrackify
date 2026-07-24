import { useEffect, useRef, useState } from 'react';
import { useLenis } from 'lenis/react';

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  /** Parallax speed multiplier (0.1 = subtle, 0.5 = strong) */
  speed?: number;
  /** Whether image moves opposite to scroll (true) or same direction (false) */
  reverse?: boolean;
  /** Container aspect ratio */
  aspectRatio?: string;
  /** Additional transform offset */
  offset?: number;
  /** Scale factor during parallax */
  scale?: number;
}

export default function ParallaxImage({
  src,
  alt,
  className = '',
  speed = 0.3,
  reverse = true,
  aspectRatio = '16/9',
  offset = 0,
  scale = 1.15,
}: ParallaxImageProps) {
  const lenis = useLenis();
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('translateY(0) scale(1)');
  const [isLoaded, setIsLoaded] = useState(false);

  // Calculate parallax transform based on scroll
  useEffect(() => {
    if (!lenis) return;

    let rafId: number;
    const container = containerRef.current;
    if (!container) return;

    const updateTransform = () => {
      const containerRect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Calculate how far the container is from viewport center
      const containerCenter = containerRect.top + containerRect.height / 2;
      const viewportCenter = viewportHeight / 2;
      const distance = containerCenter - viewportCenter;

      // Apply parallax transform
      const translateY = reverse ? -distance * speed : distance * speed;
      const scaleFactor = 1 + Math.abs(distance) / viewportHeight * (scale - 1) * 0.5;

      setTransform(`translateY(${translateY + offset}px) scale(${scaleFactor})`);

      rafId = requestAnimationFrame(updateTransform);
    };

    rafId = requestAnimationFrame(updateTransform);
    return () => cancelAnimationFrame(rafId);
  }, [lenis, speed, reverse, offset, scale]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio }}
    >
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          opacity: isLoaded ? 1 : 0,
          transform,
          willChange: 'transform, opacity',
        }}
      >
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Placeholder while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-surface-800 animate-pulse" />
      )}
    </div>
  );
}