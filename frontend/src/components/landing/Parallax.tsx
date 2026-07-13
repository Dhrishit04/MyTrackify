import { useRef, type CSSProperties, type ReactNode } from 'react';
import { useLenis } from 'lenis/react';

interface ParallaxProps {
  children: ReactNode;
  /** Motion strength. Higher = more pronounced differential movement. */
  speed?: number;
  className?: string;
  style?: CSSProperties;
}

export default function Parallax({ children, speed = 0.15, className = '', style }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLenis(() => {
    const el = ref.current;
    if (!el) return;

    // undo last frame's transform so we read the real layout position
    const current = parseFloat(el.dataset.py || '0');
    const rect = el.getBoundingClientRect();
    const topNoTransform = rect.top - current;
    const elementCenter = topNoTransform + rect.height / 2;
    const viewportCenter = window.innerHeight / 2;
    const delta = elementCenter - viewportCenter;
    const next = -delta * speed;

    el.style.transform = `translate3d(0, ${next.toFixed(2)}px, 0)`;
    el.dataset.py = String(next);
  });

  return (
    <div ref={ref} className={className} style={{ willChange: 'transform', ...style }}>
      {children}
    </div>
  );
}
