import { useEffect, useRef, useState } from 'react';
import { useLenis } from 'lenis/react';

interface ScrollRevealTextProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
  className?: string;
  /** Split by: 'chars' | 'words' | 'lines' */
  splitBy?: 'chars' | 'words' | 'lines';
  /** Stagger delay between each unit (ms) */
  stagger?: number;
  /** Start reveal at scroll progress (0-1) */
  startProgress?: number;
  /** End reveal at scroll progress (0-1) */
  endProgress?: number;
  /** Additional delay before start (ms) */
  delay?: number;
  /** Easing function */
  ease?: string;
}

export default function ScrollRevealText({
  text,
  as: Tag = 'p',
  className = '',
  splitBy = 'words',
  stagger = 50,
  startProgress = 0.1,
  endProgress = 0.6,
  delay = 0,
  ease = 'cubic-bezier(0.16, 1, 0.3, 1)',
}: ScrollRevealTextProps) {
  const lenis = useLenis();
  const containerRef = useRef<HTMLParagraphElement>(null);
  const [progress, setProgress] = useState(0);
  const [units, setUnits] = useState<string[]>([]);

  // Split text into units on mount
  useEffect(() => {
    if (splitBy === 'chars') {
      setUnits([...text]);
    } else if (splitBy === 'words') {
      setUnits(text.split(' ').map((w, i) => (i > 0 ? ' ' + w : w)));
    } else {
      setUnits([text]);
    }
  }, [text, splitBy]);

  // Scroll-linked progress
  useEffect(() => {
    if (!lenis) return;

    let rafId: number;
    const container = containerRef.current;
    if (!container) return;

    const updateProgress = () => {
      const scrollY = lenis.scroll;
      const containerRect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      const containerTop = containerRect.top + scrollY;
      const containerHeight = containerRect.height;
      const startScroll = containerTop - viewportHeight * startProgress;
      const endScroll = containerTop + containerHeight * endProgress;

      const p = Math.min(1, Math.max(0, (scrollY - startScroll) / (endScroll - startScroll)));
      setProgress(p);

      rafId = requestAnimationFrame(updateProgress);
    };

    rafId = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(rafId);
  }, [lenis, startProgress, endProgress]);

  // Calculate which units should be visible
  const visibleCount = Math.floor(units.length * progress);
  const currentUnitProgress = units.length > 0 ? (progress * units.length) % 1 : 0;

  return (
    <Tag
      ref={containerRef}
      className={`scroll-reveal-text ${className}`}
      aria-label={text}
    >
      {units.map((unit, index) => {
        const isFullyVisible = index < visibleCount;
        const isCurrent = index === visibleCount && progress < 1;
        const unitProgress = isCurrent ? currentUnitProgress : isFullyVisible ? 1 : 0;

        const unitStyle: React.CSSProperties = {
          opacity: unitProgress,
          transform: `translateY(${20 * (1 - unitProgress)}px)`,
          filter: `blur(${8 * (1 - unitProgress)}px)`,
          transition: `opacity ${stagger}ms ${ease}, transform ${stagger}ms ${ease}, filter ${stagger}ms ${ease}`,
          transitionDelay: `${delay + index * stagger}ms`,
          display: 'inline-block',
          willChange: 'opacity, transform, filter',
        };

        return (
          <span
            key={index}
            className="reveal-unit"
            style={unitStyle}
            aria-hidden="true"
          >
            {unit}
          </span>
        );
      })}
    </Tag>
  );
}