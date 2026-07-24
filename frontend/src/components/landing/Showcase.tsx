import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, TrendingUp, ArrowUpRight } from 'lucide-react';
import Reveal from './Reveal';
import RevealText from './RevealText';
import Parallax from './Parallax';
import TiltCard from './TiltCard';
import TrackMark from '../brand/TrackMark';
import { useLenis } from 'lenis/react';

const STEPS = [
  {
    n: '01',
    title: 'Capture every interview',
    desc: 'Log each round as it happens — companies, processes, questions, and outcomes — in a guided form.',
  },
  {
    n: '02',
    title: 'Build the campus brain',
    desc: 'Every experience joins a shared, verified library of company processes and real student stories.',
  },
  {
    n: '03',
    title: 'Train your readiness',
    desc: 'Readiness scoring, skill radar, and cohort comparison turn raw data into a clear action plan.',
  },
];

export default function Showcase() {
  const lenis = useLenis();
  const stepsRef = useRef<HTMLDivElement>(null);
  const [stepsProgress, setStepsProgress] = useState(0);
  const [cardProgress, setCardProgress] = useState(0);

  // Track scroll progress for step animations
  useEffect(() => {
    if (!lenis) return;
    let rafId: number;
    const container = stepsRef.current;
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
      setStepsProgress(p);
      rafId = requestAnimationFrame(updateProgress);
    };

    rafId = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(rafId);
  }, [lenis]);

  // Track card progress
  useEffect(() => {
    if (!lenis) return;
    let rafId: number;
    const container = document.querySelector('.sticky-scroll-through');
    if (!container) return;

    const updateCardProgress = () => {
      const scrollY = lenis.scroll;
      const containerRect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      const containerTop = containerRect.top + scrollY;
      const containerHeight = containerRect.height;
      const startScroll = containerTop - viewportHeight * 0.9;
      const endScroll = containerTop + containerHeight * 0.2;

      const p = Math.min(1, Math.max(0, (scrollY - startScroll) / (endScroll - startScroll)));
      setCardProgress(p);
      rafId = requestAnimationFrame(updateCardProgress);
    };

    rafId = requestAnimationFrame(updateCardProgress);
    return () => cancelAnimationFrame(rafId);
  }, [lenis]);

  return (
    <section id="showcase" className="relative overflow-hidden px-4 py-24 sm:px-6">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse at 70% 30%, rgba(20,184,166,0.10) 0%, transparent 55%)',
        }}
      />

      {/* Ambient floating orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-accent-500/5 rounded-full blur-[200px] animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-primary-500/5 rounded-full blur-[150px] animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-success-500/3 rounded-full blur-[120px] animate-float" style={{ animationDelay: '5s', transform: 'translate(-50%, -50%)' }} />
      </div>

      <div className="sticky-scroll-through mx-auto max-w-7xl">
        <div ref={stepsRef} style={{ willChange: 'transform' }}>
          <Reveal>
            <span className="inline-block rounded-full border border-accent-400/20 bg-accent-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-300 animate-fade-in">
              How it works
            </span>
            <RevealText
              as="h2"
              className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl"
              text="From scattered notes to a smart system"
              mode="words"
              stagger={45}
            />
            <p className="mt-4 max-w-md text-base text-surface-300 animate-slide-up" style={{ animationDelay: '300ms' }}>
              MyTrackify turns the interview knowledge seniors take with them into an asset the
              whole campus keeps.
            </p>
          </Reveal>

          <div className="mt-10 space-y-6">
            {STEPS.map((s, i) => (
              <Reveal
                key={s.n}
                delay={i * 90}
                className={`flex gap-4 ${i === 0 ? '' : ''}`}
                style={{
                  opacity: 1 - stepsProgress * 0.3,
                  transform: `translateX(${20 * (1 - stepsProgress)}px)`,
                  filter: `blur(${4 * (1 - stepsProgress)}px)`,
                  transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), filter 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 font-bold text-primary-300 transition-all duration-500 group-hover:scale-110 group-hover:bg-primary-500/10 group-hover:border-primary-400/30">
                  {s.n}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white animate-slide-in-right" style={{ animationDelay: `${i * 90 + 100}ms`, animationFillMode: 'both' }}>{s.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-surface-300 animate-fade-in" style={{ animationDelay: `${i * 90 + 200}ms`, animationFillMode: 'both' }}>{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="relative" style={{ willChange: 'transform' }}>
          <div data-cursor="view" data-cursor-label="Drag">
            <TiltCard
              initial={{ x: -8, y: 14 }}
              className="will-change-transform"
            >
              <Reveal className="relative block rounded-3xl border border-white/10 bg-surface-900 p-5 shadow-2xl shadow-black/40" style={{
                opacity: 0.3 + cardProgress * 0.7,
                transform: `translateY(${30 * (1 - cardProgress)}px) perspective(1000px) rotateX(${-8 * (1 - cardProgress)}deg) rotateY(${14 * (1 - cardProgress)}deg)`,
                filter: `blur(${8 * (1 - cardProgress)}px)`,
                transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), filter 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary-500">
                      <TrackMark className="h-4 w-4 text-white" strokeWidth={2.2} />
                    </div>
                    <span className="text-sm font-semibold text-white">Your readiness</span>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-success-500/10 px-2.5 py-1 text-xs font-medium text-success-400 animate-pulse-soft">
                    <TrendingUp className="h-3.5 w-3.5" /> +12%
                  </span>
                </div>

                <div className="mt-5">
                  <div className="mb-1.5 flex items-end justify-between text-xs">
                    <span className="text-surface-400">Overall readiness</span>
                    <span className="font-bold text-white animate-count-up">82%</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-800">
                    <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-primary-500 to-accent-400 animate-grow" style={{ animationDelay: '500ms' }} />
                  </div>
                </div>

                <div className="mt-5 space-y-2.5">
                  {[
                    { c: 'Google', s: 'OA cleared', t: 'success' },
                    { c: 'Amazon', s: 'Interview', t: 'primary' },
                    { c: 'Microsoft', s: 'Applied', t: 'muted' },
                  ].map((row, i) => (
                    <div
                      key={row.c}
                      className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-3.5 py-2.5 transition-all duration-300 hover:bg-white/5 hover:border-white/10 animate-slide-in-right"
                      style={{ animationDelay: `${i * 100 + 300}ms`, animationFillMode: 'both' }}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="grid h-7 w-7 place-items-center rounded-md bg-surface-800 text-[10px] font-bold text-surface-200">
                          {row.c[0]}
                        </div>
                        <span className="text-sm font-medium text-surface-100">{row.c}</span>
                      </div>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          row.t === 'success'
                            ? 'bg-success-500/10 text-success-400'
                            : row.t === 'primary'
                            ? 'bg-primary-500/10 text-primary-300'
                            : 'bg-surface-700/60 text-surface-300'
                        }`}
                      >
                        {row.s}
                      </span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </TiltCard>
          </div>

          <Parallax speed={0.22} className="absolute -right-4 -top-6 hidden sm:block">
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-surface-900 px-4 py-3 shadow-xl shadow-black/40 animate-float-slow">
              <CheckCircle2 className="h-5 w-5 text-success-400" />
              <div className="leading-tight">
                <p className="text-xs font-semibold text-white">3 offers</p>
                <p className="text-[10px] text-surface-400">this season</p>
              </div>
            </div>
          </Parallax>

          <Parallax speed={0.3} className="absolute -left-5 bottom-10 hidden sm:block">
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-surface-900 px-4 py-3 shadow-xl shadow-black/40 animate-float-slow" style={{ animationDelay: '2s' }}>
              <ArrowUpRight className="h-5 w-5 text-accent-400" />
              <div className="leading-tight">
                <p className="text-xs font-semibold text-white">+5 experiences</p>
                <p className="text-[10px] text-surface-400">logged this week</p>
              </div>
            </div>
          </Parallax>
        </div>
      </div>
    </section>
  );
}
