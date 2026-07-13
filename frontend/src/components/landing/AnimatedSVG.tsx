import { useEffect, useRef, useState } from 'react';

export default function AnimatedSVG({ className = '' }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setDrawn(true);
          o.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    o.observe(el);
    return () => o.disconnect();
  }, []);

  const nodes = [
    { x: 170, y: 120, label: 'Apply' },
    { x: 300, y: 150, label: 'Interview' },
    { x: 388, y: 90, label: 'Offer' },
  ];

  return (
    <svg
      ref={ref}
      viewBox="0 0 420 300"
      className={`animated-svg ${drawn ? 'is-drawn' : ''} ${className}`}
      fill="none"
      role="img"
      aria-label="A winding path from application to offer"
    >
      <defs>
        <linearGradient id="svg-g" x1="0" y1="0" x2="420" y2="300" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f59e0b" />
          <stop offset="1" stopColor="#fcd34d" />
        </linearGradient>
      </defs>

      <path
        className={`draw-path ${drawn ? 'is-drawn' : ''}`}
        d="M30 232 C 90 232, 110 120, 170 120 S 250 232, 300 150 S 360 70, 388 90"
        stroke="url(#svg-g)"
        strokeWidth="3"
        strokeLinecap="round"
        pathLength={1}
      />

      <circle cx="30" cy="232" r="7" fill="var(--color-primary-500)" className="node" style={{ transitionDelay: '0.6s' }} />

      {nodes.map((n, i) => (
        <g key={n.label} className="node" style={{ transitionDelay: `${1 + i * 0.25}s` }}>
          <circle cx={n.x} cy={n.y} r="6" fill="var(--color-surface-900)" stroke="url(#svg-g)" strokeWidth="3" />
          <circle cx={n.x} cy={n.y} r="2.5" fill="var(--color-accent-400)" />
        </g>
      ))}

      <g transform="translate(360 210)">
        <rect className="bar" x="0" y="0" width="12" height="34" rx="3" fill="var(--color-primary-500)" style={{ transitionDelay: '1.6s' }} />
        <rect className="bar" x="18" y="-14" width="12" height="48" rx="3" fill="var(--color-accent-400)" style={{ transitionDelay: '1.75s' }} />
        <rect className="bar" x="36" y="-28" width="12" height="62" rx="3" fill="var(--color-primary-300)" style={{ transitionDelay: '1.9s' }} />
      </g>

      <g className="float-slow" style={{ transformOrigin: 'center' }}>
        <path d="M70 60 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3z" fill="var(--color-primary-400)" opacity="0.9" />
      </g>
      <g className="float-slow" style={{ transformOrigin: 'center', animationDelay: '1.5s' }}>
        <path d="M250 50 l2.5 6 6 2.5 -6 2.5 -2.5 6 -2.5 -6 -6 -2.5 6 -2.5z" fill="var(--color-accent-400)" opacity="0.85" />
      </g>
    </svg>
  );
}
