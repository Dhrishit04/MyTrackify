import { useEffect, useRef, useState } from 'react';
import { useLenis } from 'lenis/react';
import Reveal from './Reveal';
import RevealText from './RevealText';

interface HorizontalScrollSectionProps {
  className?: string;
  /** Items to scroll horizontally */
  items: Array<{
    id: string | number;
    title: string;
    description: string;
    icon?: React.ReactNode;
    image?: string;
    color?: string;
    gradient?: string;
  }>;
  /** Section title */
  sectionTitle?: string;
  /** Section subtitle */
  sectionSubtitle?: string;
  /** Height in viewport heights for the pin duration */
  pinHeight?: number;
  /** Minimum scroll progress before horizontal scroll starts */
  startProgress?: number;
}

const DEFAULT_COLORS = [
  'from-primary-500/20 to-primary-500/5',
  'from-accent-500/20 to-accent-500/5',
  'from-success-500/20 to-success-500/5',
  'from-warning-500/20 to-warning-500/5',
  'from-danger-500/20 to-danger-500/5',
];

export default function HorizontalScrollSection({
  className = '',
  items,
  sectionTitle,
  sectionSubtitle,
  pinHeight = 5,
  startProgress = 0.1,
}: HorizontalScrollSectionProps) {
  const lenis = useLenis();
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isPinning, setIsPinning] = useState(false);

  // Track scroll progress for horizontal scroll
  useEffect(() => {
    if (!lenis) return;

    let rafId: number;
    const container = containerRef.current;
    if (!container) return;

    const updateProgress = () => {
      const scrollY = lenis.scroll;
      const containerRect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Calculate pin start/end based on container position
      const containerTop = containerRect.top + scrollY;
      const pinStart = containerTop - viewportHeight * startProgress;
      const pinEnd = pinStart + viewportHeight * pinHeight;

      if (scrollY >= pinStart && scrollY <= pinEnd) {
        const progress = Math.min(1, Math.max(0, (scrollY - pinStart) / (pinEnd - pinStart)));
        setScrollProgress(progress);
        setIsPinning(true);
      } else if (scrollY < pinStart) {
        setScrollProgress(0);
        setIsPinning(false);
      } else {
        setScrollProgress(1);
        setIsPinning(true);
      }

      rafId = requestAnimationFrame(updateProgress);
    };

    rafId = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(rafId);
  }, [lenis, pinHeight, startProgress]);

  // Apply horizontal transform to track
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const maxScroll = track.scrollWidth - track.clientWidth;
    const translateX = -scrollProgress * maxScroll;

    track.style.transform = `translateX(${translateX}px)`;
  }, [scrollProgress]);

  return (
    <section
      ref={containerRef}
      id="horizontal-scroll"
      className={`relative ${className}`}
      style={{ height: `${pinHeight * 100}vh` }}
    >
      {/* Sticky content area */}
      <div
        className="sticky top-0 h-screen flex flex-col items-center justify-center px-4 sm:px-6"
        style={{ willChange: 'transform' }}
      >
        {/* Background glow that follows progress */}
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background: `radial-gradient(ellipse at ${50 + scrollProgress * 30}% 50%, rgba(245,158,11,0.15) 0%, transparent 50%)`,
            transition: 'background 0.1s linear',
            willChange: 'background',
          }}
        />

        {sectionTitle && (
          <RevealText
            as="h2"
            className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl max-w-3xl"
            text={sectionTitle}
            mode="chars"
            stagger={30}
          />
        )}

        {sectionSubtitle && (
          <p className="mt-4 max-w-2xl text-center text-base text-surface-300 sm:text-lg">
            {sectionSubtitle}
          </p>
        )}

        {/* Horizontal scroll track */}
        <div
          ref={trackRef}
          className="relative mt-10 w-full max-w-[4000px] flex gap-6 overflow-hidden"
          style={{
            willChange: 'transform',
            transform: 'translateX(0)',
            transition: 'transform 0.1s linear',
          }}
        >
          {items.map((item, index) => (
            <Reveal
              key={item.id}
              delay={index * 100}
              className="flex-shrink-0 w-[380px] sm:w-[420px] lg:w-[460px]"
            >
              <div
                className="relative h-[380px] sm:h-[420px] rounded-3xl overflow-hidden border border-white/10 bg-surface-900/50 shadow-2xl shadow-black/40 backdrop-blur-xl transition-all duration-500 hover:border-primary-400/30 hover:shadow-primary-500/10"
                style={{
                  background: item.gradient || DEFAULT_COLORS[index % DEFAULT_COLORS.length],
                }}
              >
                {/* Icon/Number badge */}
                <div className="absolute top-5 left-5 z-10 flex items-center gap-2 rounded-xl bg-black/60 px-4 py-2 backdrop-blur-sm border border-white/10">
                  {item.icon ? (
                    <span className="text-2xl">{item.icon}</span>
                  ) : (
                    <span className="text-sm font-bold text-primary-300">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  )}
                  <span className="text-xs font-semibold uppercase tracking-wider text-surface-200">
                    Feature {index + 1}
                  </span>
                </div>

                {/* Image if provided */}
                {item.image && (
                  <div className="absolute inset-0 -z-10 opacity-30">
                    <img
                      src={item.image}
                      alt=""
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-sm text-base leading-relaxed text-surface-300">
                    {item.description}
                  </p>
                </div>

                {/* Progress indicator at bottom */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-accent-400 transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"
                />
              </div>
            </Reveal>
          ))}
        </div>

        {/* Scroll indicator */}
        <div
          className="mt-8 flex items-center justify-center gap-2 text-surface-500"
          style={{ opacity: isPinning ? 1 : 0, transition: 'opacity 0.3s ease' }}
        >
          <span className="text-xs font-medium uppercase tracking-wider">
            Scroll to explore
          </span>
          <svg
            className="h-5 w-5 animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 11l-5 5m0 0l-5-5m5 5V6"
            />
          </svg>
        </div>
      </div>

      {/* Progress bar at top of viewport */}
      <div
        className="fixed top-0 left-0 right-0 h-1 bg-surface-800 z-50"
        style={{ transform: `translateY(${isPinning ? 0 : -100}%)`, transition: 'transform 0.3s ease' }}
      >
        <div
          className="h-full bg-gradient-to-r from-primary-500 to-accent-400"
          style={{
            transform: `scaleX(${scrollProgress})`,
            transformOrigin: 'left',
            transition: 'transform 0.1s linear',
            willChange: 'transform',
          }}
        />
      </div>
    </section>
  );
}