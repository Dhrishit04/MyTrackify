import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

const ACTIVE_ROUTES = ['/', '/login', '/register'];

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

  useEffect(() => {
    if (!enabled) return;

    const move = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }

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
      ring.current.x += (mouse.current.x - ring.current.x) * 0.18;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener('mousemove', move);
    return () => {
      window.removeEventListener('mousemove', move);
      cancelAnimationFrame(raf);
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
