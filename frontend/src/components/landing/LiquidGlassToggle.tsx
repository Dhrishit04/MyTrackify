import { useState } from 'react';
import { NotebookPen, Radar, Trophy, CheckCircle2, type LucideIcon } from 'lucide-react';

interface Category {
  key: string;
  label: string;
  icon: LucideIcon;
  title: string;
  desc: string;
  points: string[];
}

const CATEGORIES: Category[] = [
  {
    key: 'prepare',
    label: 'Prepare',
    icon: NotebookPen,
    title: 'Capture it before it disappears',
    desc: 'Seniors take their notes with them. MyTrackify keeps every round, question, and tip on campus.',
    points: ['Guided multi-step experience logging', 'Searchable company process library', 'Peer tips & resources'],
  },
  {
    key: 'track',
    label: 'Track',
    icon: Radar,
    title: 'See your whole placement funnel',
    desc: 'One calm view of applications, statuses, and the readiness score that tells you where to focus.',
    points: ['Live application & status stats', 'Readiness scoring over time', 'Skill radar & cohort comparison'],
  },
  {
    key: 'land',
    label: 'Land',
    icon: Trophy,
    title: 'Turn prep into offers',
    desc: 'Follow outcomes across your cohort, surface referral and mentor leads, and pay it forward.',
    points: ['Offer & outcome tracking', 'Referral and mentor leads', 'Wins shared back to campus'],
  },
];

export default function LiquidGlassToggle() {
  const [active, setActive] = useState(0);
  const cat = CATEGORIES[active];

  return (
    <div className="w-full">
      <div className="liquid-toggle mx-auto w-fit" role="tablist" aria-label="Feature categories">
        <span
          className="liquid-toggle__thumb"
          style={{ transform: `translateX(${active * 100}%)` }}
          aria-hidden
        />
        {CATEGORIES.map((c, i) => (
          <button
            key={c.key}
            type="button"
            role="tab"
            aria-selected={active === i}
            onClick={() => setActive(i)}
            className={`liquid-toggle__seg ${active === i ? 'is-active' : ''}`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div key={cat.key} className="liquid-panel animate-fade-in mt-6">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary-500 text-white shadow-lg shadow-primary-500/25">
            <cat.icon className="h-6 w-6" strokeWidth={1.8} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white sm:text-xl">{cat.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-surface-300">{cat.desc}</p>
          </div>
        </div>

        <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
          {cat.points.map((p) => (
            <li key={p} className="flex items-center gap-2.5 text-sm text-surface-200">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-primary-400" />
              {p}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
