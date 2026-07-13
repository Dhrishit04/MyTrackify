// Submit button that drifts toward the cursor. We measure the stable outer
// wrapper rather than the moving button, so the offset math can't feed back on itself.

import { useRef, useState, type ButtonHTMLAttributes, type ReactNode } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  strength?: number;
}

export default function MagneticButton({
  children,
  strength = 0.2,
  className = '',
  type = 'submit',
  ...rest
}: Props) {
  const outerRef = useRef<HTMLSpanElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const onMove = (e: React.MouseEvent) => {
    const r = outerRef.current?.getBoundingClientRect();
    if (!r) return;
    setPos({
      x: (e.clientX - (r.left + r.width / 2)) * strength,
      y: (e.clientY - (r.top + r.height / 2)) * strength,
    });
  };
  const onLeave = () => setPos({ x: 0, y: 0 });

  return (
    <span
      ref={outerRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ display: 'flex', flex: '1 1 0%', width: '100%', willChange: 'transform' }}
    >
      <button type={type} className={className} style={{ transform: `translate3d(${pos.x}px, ${pos.y}px, 0)` }} {...rest}>
        {children}
      </button>
    </span>
  );
}
