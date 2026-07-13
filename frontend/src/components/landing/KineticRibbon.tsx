import { Sparkles } from 'lucide-react';

const STATEMENTS = [
  'PREPARE SMARTER',
  'LAND YOUR OFFER',
  '500+ EXPERIENCES',
  'REAL INSIGHTS',
  'BUILT BY STUDENTS',
  'NEVER START FROM ZERO',
];

export default function KineticRibbon() {
  const row = [...STATEMENTS, ...STATEMENTS];
  return (
    <section className="relative overflow-hidden border-y border-white/5 bg-surface-950/60 py-5" aria-hidden>
      <div className="marquee-mask overflow-hidden">
        <div className="animate-marquee marquee-track flex w-max items-center gap-8 pr-8">
          {row.map((s, i) => (
            <span key={i} className="flex items-center gap-8">
              <span className="text-2xl font-extrabold uppercase tracking-tight text-surface-200 sm:text-3xl">
                {s}
              </span>
              <Sparkles className="h-5 w-5 text-primary-400" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
