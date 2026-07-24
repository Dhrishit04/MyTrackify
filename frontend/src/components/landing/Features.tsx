import { useRef, useState, useEffect } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard, Building2, NotebookPen, Radar, UserCircle2, ShieldCheck,
} from 'lucide-react';
import Reveal from './Reveal';
import RevealText from './RevealText';
import ImageReveal from './ImageReveal';
import { useLenis } from 'lenis/react';

interface Feature {
  icon: LucideIcon;
  title: string;
  desc: string;
  points: string[];
}

const FEATURES: Feature[] = [
  {
    icon: LayoutDashboard,
    title: 'Placement Dashboard',
    desc: 'Your whole prep at a glance — application counts, status breakdowns, and recent activity in one calm view.',
    points: ['Live application stats', 'Status & offer charts', 'Recent activity feed'],
  },
  {
    icon: Building2,
    title: 'Company Library',
    desc: 'Search and filter companies, then dig into their real interview processes and student-written experiences.',
    points: ['12+ tracked companies', 'Process timelines', 'Verified experiences'],
  },
  {
    icon: NotebookPen,
    title: 'Log Experience',
    desc: 'Capture every round of an interview with a guided, multi-step form — so the next cohort learns from you.',
    points: ['Guided multi-step form', 'Rounds & outcomes', 'Tips & resources'],
  },
  {
    icon: Radar,
    title: 'Readiness Analytics',
    desc: 'A personalized readiness calculator, skill radar, and cohort comparison show you exactly where to focus.',
    points: ['Readiness scoring', 'Skill radar', 'Cohort comparison'],
  },
  {
    icon: UserCircle2,
    title: 'Student Profile',
    desc: 'Keep your coding stats, applications, and history in one place — your personal placement record.',
    points: ['Coding stats', 'Application history', 'Progress over time'],
  },
  {
    icon: ShieldCheck,
    title: 'Admin Console',
    desc: 'Curators keep the knowledge base clean — moderating experiences and managing the company catalog.',
    points: ['Moderation queue', 'Company catalog', 'Spam-free feed'],
  },
];

export default function Features() {
  const lenis = useLenis();
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const [leftProgress, setLeftProgress] = useState(0);
  const [rightProgress, setRightProgress] = useState(0);

  // Parallax effect for the image
  useEffect(() => {
    if (!lenis) return;
    let rafId: number;
    const updateParallax = () => {
      if (!leftRef.current || !rightRef.current) return;
      const leftRect = leftRef.current.getBoundingClientRect();
      const rightRect = rightRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Left column parallax
      const leftCenter = leftRect.top + leftRect.height / 2;
      const leftDist = (viewportHeight / 2 - leftCenter) / viewportHeight;
      setLeftProgress(Math.max(-1, Math.min(1, leftDist * 0.5)));

      // Right column parallax
      const rightCenter = rightRect.top + rightRect.height / 2;
      const rightDist = (viewportHeight / 2 - rightCenter) / viewportHeight;
      setRightProgress(Math.max(-1, Math.min(1, rightDist * 0.5)));

      rafId = requestAnimationFrame(updateParallax);
    };
    rafId = requestAnimationFrame(updateParallax);
    return () => cancelAnimationFrame(rafId);
  }, [lenis]);

  return (
    <section id="features" className="relative px-4 py-24 sm:px-6">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse at 80% 20%, rgba(245,158,11,0.08) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(245,158,11,0.05) 0%, transparent 40%)',
        }}
      />

      {/* Floating ambient orbs */}
      <div className="pointer-events-none absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-10 w-80 h-80 bg-primary-500/5 rounded-full blur-[150px] animate-float" style={{ animationDelay: '0s', transform: `translateY(${leftProgress * 30}px)` }} />
        <div className="absolute bottom-1/4 right-10 w-64 h-64 bg-accent-500/5 rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s', transform: `translateY(${rightProgress * -30}px)` }} />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-primary-400/3 rounded-full blur-[100px] animate-float" style={{ animationDelay: '4s', transform: `translate(-50%, calc(-50% + ${leftProgress * 20}px))` }} />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
        <div ref={leftRef} style={{ willChange: 'transform' }}>
          <Reveal className="mx-auto max-w-2xl text-center lg:text-left">
            <span className="inline-block rounded-full border border-primary-400/20 bg-primary-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-300 animate-fade-in">
              What you get
            </span>
            <RevealText
              as="h2"
              className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl"
              text="Everything placement prep should come with"
              mode="words"
              stagger={50}
            />
            <p className="mt-4 text-base text-surface-300 animate-slide-up" style={{ animationDelay: '300ms' }}>
              One platform to capture, study, and act on the interview intelligence your campus already has.
            </p>
          </Reveal>
        </div>

        <Reveal delay={200}>
          <div ref={rightRef} style={{ willChange: 'transform' }}>
            <ImageReveal
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80"
              alt="Dashboard preview showing placement analytics"
              className="rounded-3xl border border-white/10"
              direction="vertical"
              scrollLinked
              aspectRatio="4/3"
            />
          </div>
        </Reveal>
      </div>

      <div className="mt-14 mx-auto max-w-7xl">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 80} className="h-full reveal-scale">
              <FeatureCard {...f} index={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon: Icon, title, desc, points, index }: Feature & { index: number }) {
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  // Stagger the icon animation
  const iconStyles = {
    transitionDelay: `${index * 50}ms`,
  } as React.CSSProperties;

  return (
    <div
      onMouseMove={onMove}
      data-cursor="view"
      data-cursor-label="Explore"
      className="feature-card spotlight card-hover group flex h-full flex-col rounded-2xl border border-white/10 bg-gradient-card p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary-400/30 hover:shadow-xl hover:shadow-primary-500/10"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="mb-5 grid h-12 w-12 place-items-center rounded-xl bg-primary-500/10 text-primary-300 ring-1 ring-inset ring-primary-400/20 transition-all duration-500 group-hover:scale-110 group-hover:ring-primary-400/40 group-hover:bg-primary-500/20">
        <Icon className="h-6 w-6" strokeWidth={1.8} style={iconStyles} />
      </div>

      <h3 className="text-lg font-bold text-white animate-slide-in-right" style={{ animationDelay: `${index * 80 + 100}ms`, animationFillMode: 'both' }}>{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-surface-300 animate-slide-up" style={{ animationDelay: `${index * 80 + 200}ms`, animationFillMode: 'both' }}>{desc}</p>

      <ul className="mt-5 space-y-2 border-t border-white/5 pt-4">
        {points.map((p, i) => (
          <li key={p} className="flex items-center gap-2 text-xs text-surface-400 animate-fade-in" style={{ animationDelay: `${index * 80 + 300 + i * 80}ms`, animationFillMode: 'both' }}>
            <span className="h-1.5 w-1.5 rounded-full bg-primary-400 animate-pulse-soft" />
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}
