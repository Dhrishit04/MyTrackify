import { useEffect, useRef, useState } from 'react';
import { useLenis } from 'lenis/react';
import Reveal from './Reveal';

interface HorizontalScrollProps {
  className?: string;
  children: React.ReactNode;
  /** Height of the horizontal scroll area in viewport heights */
  vh?: number;
  /** Minimum scroll progress before horizontal scroll starts */
  startProgress?: number;
  /** Maximum scroll progress (0-1) */
  endProgress?: number;
}

const HORIZONTAL_SCROLL_ITEMS = [
  {
    id: 1,
    icon: '📊',
    title: 'Interview Intelligence',
    desc: 'Real experiences from your campus — not generic advice.',
    color: 'primary',
    gradient: 'from-primary-500/20 to-primary-500/5',
  },
  {
    id: 2,
    icon: '🧠',
    title: 'Readiness Scoring',
    desc: 'AI-powered analysis of your prep vs. company patterns.',
    color: 'accent',
    gradient: 'from-accent-500/20 to-accent-500/5',
  },
  {
    id: 3,
    icon: '🎯',
    title: 'Skill Radar',
    desc: 'Visualize gaps across technical, behavioral, and domain skills.',
    color: 'success',
    gradient: 'from-success-500/20 to-success-500/5',
  },
  {
    id: 4,
    icon: '🔗',
    title: 'Referral Network',
    desc: 'Unlock warm intros through verified senior connections.',
    color: 'warning',
    gradient: 'from-warning-500/20 to-warning-500/5',
  },
  {
    id: 5,
    icon: '📈',
    title: 'Cohort Benchmarks',
    desc: 'See how you stack up against your batch — anonymously.',
    color: 'danger',
    gradient: 'from-danger-500/20 to-danger-500/5',
  },
];

export default function HorizontalScroll({
  className = '',
  children,
  vh = 5,
  startProgress = 0.1,
  endProgress = 0.9,
}: HorizontalScrollProps) {
  const lenis = useLenis();
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isActive, setIsActive] = useState(false);

  // Track scroll progress for horizontal scroll
  useEffect(() => {
    let rafId: number;
    const container = containerRef.current;
    if (!container) return;

    const updateProgress = () => {
      const scrollY = lenis?.scroll ?? window.scrollY;
      const containerRect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Calculate when container enters/exits viewport
      const containerTop = containerRect.top + scrollY;
      const containerHeight = containerRect.height;

      // Start when top of container reaches viewport center (approximately)
      const startScroll = containerTop - viewportHeight * startProgress;
      const endScroll = startScroll + containerHeight * (endProgress - startProgress);

      const progress = Math.min(1, Math.max(0, (scrollY - startScroll) / (endScroll - startScroll)));

      setScrollProgress(progress);
      setIsActive(progress > 0 && progress < 1);

      rafId = requestAnimationFrame(updateProgress);
    };

    rafId = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(rafId);
  }, [lenis, startProgress, endProgress]);

  // Handle horizontal scroll when active
  useEffect(() => {
    if (!isActive || !lenis) return;

    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const maxScroll = wrapper.scrollWidth - wrapper.clientWidth;
    const targetScroll = scrollProgress * maxScroll;

    // Smooth horizontal scroll using Lenis
    lenis.scrollTo(targetScroll, {
      immediate: false,
      lerp: 0.1,
    });
  }, [isActive, scrollProgress, lenis]);

  // Use provided children or default items
  const items = children ? undefined : HORIZONTAL_SCROLL_ITEMS;

  return (
    <section
      ref={containerRef}
      id="horizontal-scroll"
      className={`relative overflow-hidden ${className}`}
      style={{ height: `${vh * 100}vh` }}
    >
      <div
        ref={wrapperRef}
        className="relative h-full w-full"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          className="flex items-center gap-8 px-4 sm:px-6 lg:px-8"
          style={{
            width: 'max-content',
            minWidth: '100%',
            transform: `translateX(0)`,
          }}
        >
          {items?.map((item, index) => (
            <Reveal key={item.id} delay={index * 100} className="flex-shrink-0">
              <div className={`w-[380px] sm:w-[420px] lg:w-[480px]`}>
                <div
                  className={`relative rounded-3xl border border-white/10 bg-gradient-to-br ${item.gradient} p-8 backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:border-white/20`}
                  style={{
                    opacity: 0.4 + scrollProgress * 0.6,
                    transform: `scale(${0.9 + scrollProgress * 0.1}) translateY(${20 * (1 - scrollProgress)}px)`,
                    filter: `blur(${8 * (1 - scrollProgress)}px)`,
                  }}
                >
                  <div className="mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-white/5 ring-1 ring-inset ring-white/10">
                    <span className="text-3xl" role="img" aria-hidden>{item.icon}</span>
                  </div>
                  <h3 className="mb-3 text-2xl font-bold tracking-tight text-white">
                    {item.title}
                  </h3>
                  <p className="text-base leading-relaxed text-surface-300">
                    {item.desc}
                  </p>

                  {/* Scroll progress indicator */}
                  <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full bg-white/50 transition-all duration-300"
                      style={{ width: `${scrollProgress * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </Reveal>
          ))}

          {children && (
            <div className="flex-shrink-0 w-full">
              {children}
            </div>
          )}
        </div>
      </div>

      {/* Scroll progress indicator on the side */}
      <div className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 hidden lg:block">
        <div className="relative h-48 w-1">
          <div className="absolute bottom-0 left-0 w-full h-full bg-white/10 rounded-full" />
          <div
            className="absolute bottom-0 left-0 w-full bg-primary-400 rounded-full transition-all duration-300"
            style={{ height: `${scrollProgress * 100}%` }}
          />
        </div>
        <div className="mt-4 text-center">
          <span className="text-xs font-mono text-surface-400">
            {Math.round(scrollProgress * 100)}%
          </span>
        </div>
      </div>

      {/* Section label */}
      <div className="pointer-events-none absolute left-6 top-6 z-10">
        <span className="inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-surface-400">
          Explore features
        </span>
      </div>
    </section>
  );
}