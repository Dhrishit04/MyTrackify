import { useCallback, useRef, useState } from 'react';

export function useMagnetic<T extends HTMLElement = HTMLDivElement>(strength = 0.35) {
  const ref = useRef<T>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const onMouseMove = useCallback(
    (e: React.MouseEvent<T>) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const mx = e.clientX - (r.left + r.width / 2);
      const my = e.clientY - (r.top + r.height / 2);
      setPos({ x: mx * strength, y: my * strength });
    },
    [strength]
  );

  const onMouseLeave = useCallback(() => setPos({ x: 0, y: 0 }), []);

  return {
    ref,
    onMouseMove,
    onMouseLeave,
    style: { transform: `translate3d(${pos.x}px, ${pos.y}px, 0)` },
  };
}
