import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLenis } from 'lenis/react';
import { ArrowRight, Play } from 'lucide-react';
import ParticleField from './ParticleField';
import TrackMark from '../brand/TrackMark';

const ROLLER = ['smarter', 'with clarity', 'with confidence', 'without guesswork'];
const HIGHLIGHTS = [
  'Real interview experiences from your campus',
  'Company process & insights library',
  'AI-powered readiness scoring',
];

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const lenis = useLenis();
  const [word, setWord] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setWord((w) => (w + 1) % ROLLER.length), 2600);
    return () => clearInterval(id);
  }, []);

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    const my = ((e.clientY - r.top) / r.height - 0.5) * 2;
    const el = e.currentTarget;
    el.style.setProperty('--mx', mx.toFixed(3));
    el.style.setProperty('--my', my.toFixed(3));
  };

  const onLeave = () => {
    rootRef.current?.style.setProperty('--mx', '0');
    rootRef.current?.style.setProperty('--my', '0');
  };

  const toFeatures = (e: React.MouseEvent) => {
    e.preventDefault();
    const t = document.querySelector('#features');
    if (t) lenis?.scrollTo(t as HTMLElement, { offset: -88 });
  };

  return (
    <section
      id="top"
      ref={rootRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative isolate flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 pt-32 pb-20 sm:px-6"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-30"
        style={{
          background:
            'radial-gradient(ellipse at 50% -10%, rgba(245,158,11,0.16) 0%, transparent 55%), radial-gradient(ellipse at 80% 90%, rgba(245,158,11,0.09) 0%, transparent 50%), var(--color-surface-950)',
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 -z-20 opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)',
          backgroundSize: '52px 52px',
          maskImage: 'radial-gradient(ellipse at 50% 40%, #000 30%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 40%, #000 30%, transparent 75%)',
        }}
      />

      <ParticleField className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-70" />

      <Orb className="left-[8%] top-[18%] h-72 w-72 bg-primary-500/20" scrollFactor={0.18} mouse={34} />
      <Orb className="right-[10%] top-[24%] h-80 w-80 bg-accent-500/15" scrollFactor={0.28} mouse={28} />
      <Orb className="left-[42%] bottom-[8%] h-64 w-64 bg-primary-400/10" scrollFactor={0.12} mouse={40} />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-surface-200 backdrop-blur-md animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-400" />
          </span>
          Campus placement intelligence, built by students
        </div>

        <h1 className="font-display text-balance text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
          Prepare{' '}
          <span className="text-gradient">smarter</span>{' '}
          <span className="relative inline-block">
            <span
              key={word}
              className="inline-block text-primary-400"
              style={{ animation: 'blurIn 0.7s cubic-bezier(0.16,1,0.3,1)' }}
            >
              {ROLLER[word]}
            </span>
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-surface-300 sm:text-lg">
          MyTrackify keeps every interview story, company process, and readiness insight from your
          campus in one place — so placement prep never starts from zero when seniors graduate.
        </p>

        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            to="/login"
            className="group inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-primary-600/25 transition-all duration-300 hover:bg-primary-500 hover:shadow-primary-500/40"
          >
            Get started free
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <a
            href="#features"
            onClick={toFeatures}
            className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-surface-100 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/10"
          >
            <Play className="h-4 w-4 fill-current" />
            Explore features
          </a>
        </div>

        <ul className="mt-10 flex flex-col items-center gap-2.5 sm:flex-row sm:flex-wrap sm:justify-center">
          {HIGHLIGHTS.map((text) => (
            <li key={text} className="flex items-center gap-2 text-sm text-surface-300">
              <TrackMark className="h-4 w-4 shrink-0 text-primary-400" strokeWidth={2.4} />
              {text}
            </li>
          ))}
        </ul>
      </div>

      <a
        href="#trusted"
        onClick={(e) => {
          e.preventDefault();
          const t = document.querySelector('#trusted');
          if (t) lenis?.scrollTo(t as HTMLElement, { offset: -88 });
        }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-surface-400 hover:text-surface-200 transition-colors"
        aria-label="Scroll down"
      >
        <div className="flex h-9 w-5 items-start justify-center rounded-full border border-white/15 p-1">
          <span className="animate-scroll-cue h-1.5 w-1 rounded-full bg-primary-400" />
        </div>
      </a>

      <style>{`
        @keyframes blurIn {
          0% { filter: blur(14px); opacity: 0; transform: translateY(10px); }
          100% { filter: blur(0); opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="blurIn"] { animation: none !important; }
        }
      `}</style>
    </section>
  );
}

function Orb({
  className = '',
  scrollFactor,
  mouse,
}: {
  className?: string;
  scrollFactor: number;
  mouse: number;
}) {
  return (
    <div
      className={`pointer-events-none absolute -z-10 rounded-full blur-[90px] ${className}`}
      style={{ transform: `translate3d(0, calc(var(--scroll, 0) * ${scrollFactor}px), 0)` }}
    >
      <div
        className="h-full w-full rounded-full animate-aurora"
        style={{
          transform: `translate3d(calc(var(--mx, 0) * ${mouse}px), calc(var(--my, 0) * ${mouse}px), 0)`,
          transition: 'transform 0.45s cubic-bezier(0.16,1,0.3,1)',
        }}
      />
    </div>
  );
}
