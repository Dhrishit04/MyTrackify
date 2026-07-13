import { useEffect, useRef, useState } from 'react';
import { useCountUp } from '../../hooks/useCountUp';
import Reveal from './Reveal';

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

const STATS: Stat[] = [
  { value: 300, suffix: '+', label: 'Students prepared' },
  { value: 12, suffix: '+', label: 'Companies tracked' },
  { value: 500, suffix: '+', label: 'Experiences shared' },
  { value: 85, suffix: '+', label: 'Offers landed' },
];

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setActive(true);
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="stats" className="relative px-4 py-24 sm:px-6">
      <Reveal className="mx-auto max-w-7xl">
        <div
          ref={ref}
          className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/5 lg:grid-cols-4"
        >
          {STATS.map((s) => (
            <StatItem key={s.label} {...s} active={active} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function StatItem({ value, suffix, label, active }: Stat & { active: boolean }) {
  const n = useCountUp(value, active, 1900);
  return (
    <div className="flex flex-col items-center gap-2 bg-surface-950 px-6 py-10 text-center">
      <p className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
        {n}
        <span className="text-gradient">{suffix}</span>
      </p>
      <p className="text-xs font-medium uppercase tracking-wider text-surface-400">{label}</p>
    </div>
  );
}
