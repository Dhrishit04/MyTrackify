import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard, Building2, NotebookPen, Radar, UserCircle2, ShieldCheck,
} from 'lucide-react';
import Reveal from './Reveal';
import RevealText from './RevealText';

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
  return (
    <section id="features" className="relative px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full border border-primary-400/20 bg-primary-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-300">
            What you get
          </span>
          <RevealText
            as="h2"
            className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl"
            text="Everything placement prep should come with"
          />
          <p className="mt-4 text-base text-surface-300">
            One platform to capture, study, and act on the interview intelligence your campus already has.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 80} className="h-full">
              <FeatureCard {...f} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon: Icon, title, desc, points }: Feature) {
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  return (
    <div
      onMouseMove={onMove}
      data-cursor="view"
      data-cursor-label="Explore"
      className="spotlight card-hover group flex h-full flex-col rounded-2xl border border-white/10 bg-gradient-card p-6 backdrop-blur-sm transition-colors duration-300 hover:border-primary-400/30"
    >
      <div className="mb-5 grid h-12 w-12 place-items-center rounded-xl bg-primary-500/10 text-primary-300 ring-1 ring-inset ring-primary-400/20 transition-transform duration-300 group-hover:scale-110">
        <Icon className="h-6 w-6" strokeWidth={1.8} />
      </div>

      <h3 className="text-lg font-bold text-white">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-surface-300">{desc}</p>

      <ul className="mt-5 space-y-2 border-t border-white/5 pt-4">
        {points.map((p) => (
          <li key={p} className="flex items-center gap-2 text-xs text-surface-400">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-400" />
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}
