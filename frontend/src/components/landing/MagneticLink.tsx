// The magnetic transform sits on the <a> itself, not a wrapping <span>.
// A transform on an ancestor of a position:fixed element becomes its
// containing block — which would yank a fixed link out of the viewport.

import { useRef, useState, type ReactNode, type AnchorHTMLAttributes, type CSSProperties } from 'react';
import { TransitionLink } from '../transition/TransitionProvider';

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  children: ReactNode;
  className?: string;
  strength?: number;
  'data-cursor'?: string;
  'data-cursor-label'?: string;
}

export default function MagneticLink({ to, children, className = '', strength = 0.35, style, ...rest }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const onMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const mx = e.clientX - (r.left + r.width / 2);
    const my = e.clientY - (r.top + r.height / 2);
    setPos({ x: mx * strength, y: my * strength });
  };
  const onMouseLeave = () => setPos({ x: 0, y: 0 });

  return (
    <TransitionLink
      to={to}
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={className}
      style={{ willChange: 'transform', transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`, ...style } as CSSProperties}
      {...rest}
    >
      {children}
    </TransitionLink>
  );
}
