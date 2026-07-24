import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

const ACTIVE_ROUTES = ['/', '/login', '/register'];

interface TrailPoint {
  x: number;
  y: number;
  timestamp: number;
}

export default function CustomCursor() {
  const { pathname } = useLocation();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(any-pointer: fine)').matches
  );
  const [label, setLabel] = useState<string | null>(null);
  const [active, setActive] = useState(false);

  const mouse = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const trailRef = useRef<TrailPoint[]>([]);
  const trailElementsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!enabled) return;

    // Create trail elements
    const trailContainer = document.createElement('div');
    trailContainer.className = 'cursor-trail';
    trailContainer.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      pointer-events: none;
      z-index: 9997;
    `;
    document.body.appendChild(trailContainer);

    // Create 8 trail dots
    for (let i = 0; i < 8; i++) {
      const dot = document.createElement('div');
      dot.className = 'cursor-trail-dot';
      dot.style.cssText = `
        position: absolute;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--color-primary-400);
        opacity: ${0.4 - i * 0.04};
        transform: translate(-50%, -50%) scale(${1 - i * 0.08});
        pointer-events: none;
        transition: opacity 0.1s ease, transform 0.1s ease;
        will-change: transform, opacity;
      `;
      trailContainer.appendChild(dot);
      trailElementsRef.current.push(dot);
    }

    const move = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };

      // Update dot position
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }

      // Add to trail
      trailRef.current.push({ x: e.clientX, y: e.clientY, timestamp: Date.now() });
      // Keep only last 50ms of trail
      const cutoff = Date.now() - 50;
      trailRef.current = trailRef.current.filter((p) => p.timestamp > cutoff);

      const target = (e.target as HTMLElement | null)?.closest('[data-cursor]') as HTMLElement | null;
      if (target) {
        setActive(true);
        setLabel(target.dataset.cursor === 'view' ? (target.dataset.cursorLabel ?? 'View') : null);
      } else {
        setActive(false);
        setLabel(null);
      }
    };

    let raf = 0;
    const loop = () => {
      // Ring easing
      ring.current.x += (mouse.current.x - ring.current.x) * 0.18;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) translate(-50%, -50%)`;
      }

      // Update trail dots
      const trail = trailRef.current;
      if (trail.length > 0) {
        trailElementsRef.current.forEach((dotEl, index) => {
          const trailIndex = Math.floor((trail.length - 1) * (index / (trailElementsRef.current.length - 1)));
          if (trail[trailIndex]) {
            dotEl.style.transform = `translate3d(${trail[trailIndex].x}px, ${trail[trailIndex].y}px, 0) translate(-50%, -50%) scale(${1 - index * 0.08})`;
            dotEl.style.opacity = `${0.4 - index * 0.04}`;
          }
        });
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener('mousemove', move);
    return () => {
      window.removeEventListener('mousemove', move);
      cancelAnimationFrame(raf);
      trailContainer.remove();
    };
  }, [enabled]);

  // Only hide the OS cursor (and render ours) on the marketing/auth pages
  useEffect(() => {
    document.body.classList.toggle('custom-cursor-on', enabled && ACTIVE_ROUTES.includes(pathname));
    return () => document.body.classList.remove('custom-cursor-on');
  }, [enabled, pathname]);

  if (!enabled || !ACTIVE_ROUTES.includes(pathname)) return null;

  return (
    <>
      <div ref={ringRef} className={`cursor-ring ${active ? 'cursor-ring--active' : ''}`} aria-hidden />
      <div ref={dotRef} className={`cursor-dot ${active ? 'cursor-dot--active' : ''}`} aria-hidden>
        {label}
      </div>
    </>
  );
}
