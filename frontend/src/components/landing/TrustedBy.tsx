import Reveal from './Reveal';

const COMPANIES = [
  'Google', 'Microsoft', 'Amazon', 'Apple', 'Meta', 'Netflix',
  'Adobe', 'Salesforce', 'Goldman Sachs', 'JP Morgan', 'Deloitte',
  'Accenture', 'Intel', 'IBM', 'Cisco', 'Oracle', 'PayPal', 'Samsung',
];

export default function TrustedBy() {
  // duplicate so the marquee loops seamlessly
  const row = [...COMPANIES, ...COMPANIES];

  return (
    <section id="trusted" className="relative border-y border-white/5 py-14">
      <Reveal className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.2em] text-surface-500">
          Students track their journeys to roles at
        </p>
      </Reveal>

      <div className="marquee-mask relative overflow-hidden">
        <div className="animate-marquee marquee-track flex w-max items-center gap-4 pr-4">
          {row.map((name, i) => (
            <div
              key={`${name}-${i}`}
              className="flex shrink-0 items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-surface-300 backdrop-blur-sm transition-colors hover:border-primary-400/40 hover:text-white"
            >
              <span className="h-2 w-2 rounded-full bg-primary-400" />
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
