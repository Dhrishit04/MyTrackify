import { useRef, useState, useEffect } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import Reveal from './Reveal';
import RevealText from './RevealText';
import MagneticLink from './MagneticLink';
import { useLenis } from 'lenis/react';

export default function CTA() {
  const lenis = useLenis();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Track scroll progress for CTA section
  useEffect(() => {
    if (!lenis) return;

    let rafId: number;
    const container = containerRef.current;
    if (!container) return;

    const updateProgress = () => {
      const scrollY = lenis.scroll;
      const containerRect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      const containerTop = containerRect.top + scrollY;
      const containerHeight = containerRect.height;
      const startScroll = containerTop - viewportHeight * 0.9;
      const endScroll = containerTop + containerHeight * 0.2;

      const p = Math.min(1, Math.max(0, (scrollY - startScroll) / (endScroll - startScroll)));
      setScrollProgress(p);

      rafId = requestAnimationFrame(updateProgress);
    };

    rafId = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(rafId);
  }, [lenis]);

  return (
    <section ref={containerRef} className="relative px-4 py-24 sm:px-6" style={{ willChange: 'transform' }}>
      {/* Ambient animated background */}
      <div className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-500/5 via-transparent to-accent-500/5 animate-pulse-soft" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[300px] animate-float" />
      </div>

      <Reveal className="mx-auto max-w-5xl">
        <div
          className="border-glow relative overflow-hidden rounded-3xl border border-white/10 bg-surface-900 px-6 py-16 text-center shadow-2xl shadow-black/40 sm:px-12"
          style={{
            opacity: 0.4 + scrollProgress * 0.6,
            transform: `translateY(${30 * (1 - scrollProgress)}px) scale(${0.98 + scrollProgress * 0.02})`,
            filter: `blur(${8 * (1 - scrollProgress)}px)`,
            transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), filter 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                'radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.16) 0%, transparent 60%)',
            }}
          />
          <div className="glow-pulse pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-primary-500/20 blur-[100px]" />

          {/* Animated gradient border */}
          <div className="absolute inset-0 -z-10 border-glow" style={{ opacity: 0.4 + scrollProgress * 0.6 }} />

          <div className="relative z-10 mx-auto max-w-2xl">
            <div className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-primary-500 shadow-lg shadow-primary-500/25 animate-float">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <RevealText
              as="h2"
              className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl"
              text="Start your placement edge today"
              mode="words"
              stagger={50}
            />
            <p className="mx-auto mt-4 max-w-xl text-base text-surface-300 animate-slide-up" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
              Join the students turning shared interview experience into offers. It takes a minute
              to begin — and the whole campus benefits.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <MagneticLink
                to="/login"
                strength={0.4}
                className="btn-kinetic group inline-flex items-center gap-2 rounded-xl bg-primary-600 px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-primary-600/25 transition-all duration-300 hover:bg-primary-500 hover:shadow-primary-500/40"
              >
                <span className="btn-kinetic__inner">
                  Log in to MyTrackify
                  <ArrowRight className="h-4 w-4" />
                </span>
                <span className="btn-kinetic__outer">
                  Log in to MyTrackify
                  <ArrowRight className="h-4 w-4" />
                </span>
              </MagneticLink>
              <MagneticLink
                to="/register"
                strength={0.4}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 text-sm font-semibold text-surface-100 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:scale-105"
              >
                Create free account
              </MagneticLink>
            </div>

            {/* Animated stats */}
            <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4" style={{ opacity: scrollProgress }}>
              {[
                { value: '300+', label: 'Students' },
                { value: '12', label: 'Companies' },
                { value: '500+', label: 'Experiences' },
                { value: '85+', label: 'Offers' },
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className="text-center animate-fade-in"
                  style={{ animationDelay: `${index * 100 + 400}ms`, animationFillMode: 'both' }}
                >
                  <p className="font-display text-2xl sm:text-3xl font-semibold text-primary-400 leading-none">{stat.value}</p>
                  <p className="text-[10px] uppercase tracking-wider text-surface-500 mt-1.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
