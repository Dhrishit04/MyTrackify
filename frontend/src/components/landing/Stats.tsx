import { useEffect, useRef, useState } from 'react';
import { useCountUp } from '../../hooks/useCountUp';
import Reveal from './Reveal';
import RevealText from './RevealText';
import { useLenis } from 'lenis/react';

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
  const lenis = useLenis();
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [individualProgress, setIndividualProgress] = useState<number[]>([0, 0, 0, 0]);

  // Track scroll progress for stats section
  useEffect(() => {
    if (!lenis) return;

    let rafId: number;
    const container = ref.current;
    if (!container) return;

    const updateProgress = () => {
      const scrollY = lenis.scroll;
      const containerRect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      const containerTop = containerRect.top + scrollY;
      const containerHeight = containerRect.height;
      const startScroll = containerTop - viewportHeight * 0.8;
      const endScroll = containerTop + containerHeight * 0.3;

      const p = Math.min(1, Math.max(0, (scrollY - startScroll) / (endScroll - startScroll)));
      setScrollProgress(p);

      // Calculate individual stat progress based on their position
      const statElements = container.querySelectorAll('.stat-item > div');
      statElements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        const statCenter = rect.top + rect.height / 2;
        const viewportCenter = viewportHeight / 2;
        const dist = Math.abs(statCenter - viewportCenter) / viewportHeight;
        const statProgress = Math.max(0, 1 - dist * 3);
        setIndividualProgress(prev => {
          const next = [...prev];
          next[index] = statProgress;
          return next;
        });
      });

      rafId = requestAnimationFrame(updateProgress);
    };

    rafId = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(rafId);
  }, [lenis]);

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
      {/* Ambient background orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary-500/5 rounded-full blur-[200px] animate-float" />
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-accent-500/5 rounded-full blur-[150px] animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-primary-400/3 rounded-full blur-[100px] animate-float" style={{ animationDelay: '4s', transform: 'translate(-50%, -50%)' }} />
      </div>

      <div className="mx-auto max-w-7xl">
        <RevealText
          as="h2"
          className="mx-auto mb-12 max-w-2xl text-center text-3xl font-semibold tracking-tight text-white sm:text-4xl"
          text="Trusted by students across campuses"
          mode="chars"
          stagger={30}
        />

        <Reveal className="reveal-scale">
          <div
            ref={ref}
            className="stat-item grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/5 lg:grid-cols-4"
            style={{
              opacity: 0.3 + scrollProgress * 0.7,
              transform: `translateY(${30 * (1 - scrollProgress)}px)`,
              filter: `blur(${8 * (1 - scrollProgress)}px)`,
              transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), filter 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {STATS.map((s, index) => (
              <StatItem
                key={s.label}
                {...s}
                active={active}
                index={index}
                progress={individualProgress[index] || 0}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function StatItem({ value, suffix, label, active, index, progress }: Stat & { active: boolean; index: number; progress: number }) {
  const n = useCountUp(value, active, 1900);
  const showCount = active && progress > 0.3;

  return (
    <div
      className="flex flex-col items-center gap-2 bg-surface-950 px-6 py-10 text-center relative overflow-hidden group"
      style={{
        opacity: 0.5 + progress * 0.5,
        transform: `translateY(${20 * (1 - progress)}px) scale(${0.95 + progress * 0.05})`,
        filter: `blur(${4 * (1 - progress)}px)`,
        transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), filter 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: `${index * 80}ms`,
      }}
    >
      {/* Animated background glow */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, rgba(245,158,11,${0.1 * progress}) 0%, transparent 70%)`,
          opacity: progress,
          transition: 'opacity 0.6s ease, background 0.6s ease',
        }}
      />

      {/* Gradient border sweep */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-accent-400 transform scale-x-0 origin-left transition-transform duration-800"
        style={{
          transform: active ? 'scaleX(1)' : 'scaleX(0)',
          transitionDelay: `${index * 80 + 500}ms`,
        }}
      />

      <p className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl relative">
        {showCount ? n : 0}
        <span className="text-gradient">{suffix}</span>
      </p>
      <p className="text-xs font-medium uppercase tracking-wider text-surface-400 animate-fade-in" style={{ animationDelay: `${index * 80 + 300}ms`, animationFillMode: 'both' }}>{label}</p>
    </div>
  );
}
