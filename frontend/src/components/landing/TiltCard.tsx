import { useRef, useState, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  initial?: { x: number; y: number };
  intensity?: number;
}

const clamp = (v: number) => Math.max(-80, Math.min(80, v));

export default function TiltCard({ children, className = '', initial = { x: -10, y: 16 }, intensity = 10 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [base, setBase] = useState(initial);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const last = useRef({ x: 0, y: 0 });

  const onPointerDown = (e: React.PointerEvent) => {
    setDragging(true);
    last.current = { x: e.clientX, y: e.clientY };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();

    if (dragging) {
      const dx = e.clientX - last.current.x;
      const dy = e.clientY - last.current.y;
      last.current = { x: e.clientX, y: e.clientY };
      setBase((b) => ({ x: clamp(b.x - dy * 0.5), y: clamp(b.y + dx * 0.5) }));
    } else {
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      setTilt({ x: -py * intensity, y: px * intensity });
      el.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
      el.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
    }
  };

  const onPointerUp = () => setDragging(false);
  const onPointerLeave = () => {
    setDragging(false);
    setTilt({ x: 0, y: 0 });
  };

  const transform = `perspective(1100px) rotateX(${base.x + tilt.x}deg) rotateY(${base.y + tilt.y}deg)`;

  return (
    <div
      ref={ref}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerLeave}
      className={`tilt-card ${dragging ? 'is-dragging' : ''} ${className}`}
      style={{ transform, touchAction: 'none' }}
    >
      {children}
      <div className="tilt-glare" />
    </div>
  );
}
