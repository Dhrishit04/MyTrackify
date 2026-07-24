import { useEffect, useRef, useState } from 'react';
import { useLenis } from 'lenis/react';

interface ImageRevealProps {
  src: string;
  alt: string;
  className?: string;
  /** Reveal direction: 'vertical' (bottom to top), 'horizontal' (left to right), 'diagonal' */
  direction?: 'vertical' | 'horizontal' | 'diagonal';
  /** Whether to use scroll progress (true) or IntersectionObserver (false) */
  scrollLinked?: boolean;
  /** Delay before reveal starts (ms) */
  delay?: number;
  /** Duration of reveal (ms) */
  duration?: number;
  /** Aspect ratio container (e.g., '16/9', '4/3', '1/1') */
  aspectRatio?: string;
}

export default function ImageReveal({
  src,
  alt,
  className = '',
  direction = 'vertical',
  scrollLinked = true,
  delay = 0,
  duration = 1200,
  aspectRatio = '16/9',
}: ImageRevealProps) {
  const lenis = useLenis();
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);

  // Scroll-linked progress
  useEffect(() => {
    if (!scrollLinked || !lenis) return;

    let rafId: number;
    const container = containerRef.current;
    if (!container) return;

    const updateProgress = () => {
      const scrollY = lenis.scroll;
      const containerRect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Calculate progress based on container position in viewport
      const containerTop = containerRect.top + scrollY;
      const containerHeight = containerRect.height;
      const startScroll = containerTop - viewportHeight * 0.8;
      const endScroll = containerTop + containerHeight * 0.3;

      const p = Math.min(1, Math.max(0, (scrollY - startScroll) / (endScroll - startScroll)));
      setProgress(p);

      rafId = requestAnimationFrame(updateProgress);
    };

    rafId = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(rafId);
  }, [lenis, scrollLinked]);

  // IntersectionObserver fallback
  useEffect(() => {
    if (scrollLinked) return;

    const container = containerRef.current;
    if (!container) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          obs.unobserve(container);
        }
      },
      { threshold: 0.3, rootMargin: '0px 0px -100px 0px' }
    );

    obs.observe(container);
    return () => obs.disconnect();
  }, [scrollLinked]);

  // Animate progress when in view (IntersectionObserver mode)
  useEffect(() => {
    if (scrollLinked || !isInView) return;

    let startTime: number;
    let rafId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime - delay;
      const p = Math.min(1, Math.max(0, elapsed / duration));
      setProgress(p);

      if (p < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [isInView, delay, duration, scrollLinked]);

  // Generate clip-path based on direction and progress
  const getClipPath = () => {
    const p = progress;

    switch (direction) {
      case 'vertical':
        // Reveal from bottom to top
        return `polygon(0 ${100 - p * 100}%, 100% ${100 - p * 100}%, 100% 100%, 0 100%)`;
      case 'horizontal':
        // Reveal from left to right
        return `polygon(0 0, ${p * 100}% 0, ${p * 100}% 100%, 0 100%)`;
      case 'diagonal':
        // Reveal from bottom-left to top-right
        return `polygon(0 ${100 - p * 100}%, ${p * 100}% ${100 - p * 100}%, ${p * 100}% 100%, 0 100%)`;
      default:
        return `polygon(0 ${100 - p * 100}%, 100% ${100 - p * 100}%, 100% 100%, 0 100%)`;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        aspectRatio,
      } as React.CSSProperties}
    >
      {/* Background placeholder while loading */}
      <div
        className="absolute inset-0 bg-surface-800 transition-opacity duration-500"
        style={{ opacity: isLoaded ? 0 : 1 }}
      />

      {/* Image with clip-path reveal */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
        style={{
          opacity: isLoaded ? 1 : 0,
          clipPath: getClipPath(),
          // Alternative: use mask for smoother edges
          // WebkitMaskImage: getMask(),
          // maskImage: getMask(),
          willChange: 'clip-path, opacity',
        }}
      />

      {/* Optional: overlay with counter or label */}
      {progress > 0 && progress < 1 && (
        <div
          className="pointer-events-none absolute bottom-4 left-4 text-xs font-mono text-white/50"
          style={{ opacity: 1 - Math.abs(progress - 0.5) * 2 }}
        >
          {Math.round(progress * 100)}%
        </div>
      )}
    </div>
  );
}