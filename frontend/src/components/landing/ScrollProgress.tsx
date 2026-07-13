import { useRef } from 'react';
import { useLenis } from 'lenis/react';

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useLenis((lenis) => {
    const el = barRef.current;
    if (!el) return;
    const limit = lenis.limit || 1;
    const p = Math.min(1, Math.max(0, lenis.scroll / limit));
    el.style.transform = `scaleX(${p})`;
  });

  return <div ref={barRef} className="scroll-progress" aria-hidden />;
}
