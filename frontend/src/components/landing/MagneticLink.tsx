// The magnetic transform sits on the <a> itself, not a wrapping <span>.
// A transform on an ancestor of a position:fixed element becomes its
// containing block — which would yank a fixed link out of the viewport.

import type { ReactNode } from 'react';
import { TransitionLink } from '../transition/TransitionProvider';
import { useMagnetic } from '../../hooks/useMagnetic';

interface Props {
  to: string;
  children: ReactNode;
  className?: string;
  strength?: number;
  'data-cursor'?: string;
  'data-cursor-label'?: string;
}

export default function MagneticLink({ to, children, className = '', strength = 0.35, ...rest }: Props) {
  const m = useMagnetic<HTMLAnchorElement>(strength);
  return (
    <TransitionLink
      to={to}
      ref={m.ref}
      onMouseMove={m.onMouseMove}
      onMouseLeave={m.onMouseLeave}
      className={className}
      style={{ willChange: 'transform', ...m.style }}
      {...rest}
    >
      {children}
    </TransitionLink>
  );
}
