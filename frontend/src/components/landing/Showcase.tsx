import { CheckCircle2, TrendingUp, ArrowUpRight } from 'lucide-react';
import Reveal from './Reveal';
import RevealText from './RevealText';
import Parallax from './Parallax';
import TiltCard from './TiltCard';
import TrackMark from '../brand/TrackMark';

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
  return (
    <section id="showcase" className="relative overflow-hidden px-4 py-24 sm:px-6">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse at 70% 30%, rgba(20,184,166,0.10) 0%, transparent 55%)',
        }}
      />

      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
        <div>
          <Reveal>
            <span className="inline-block rounded-full border border-accent-400/20 bg-accent-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-300">
              How it works
            </span>
            <RevealText
              as="h2"
              className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl"
              text="From scattered notes to a smart system"
            />
            <p className="mt-4 max-w-md text-base text-surface-300">
              MyTrackify turns the interview knowledge seniors take with them into an asset the
              whole campus keeps.
            </p>
          </Reveal>

          <div className="mt-10 space-y-6">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 90} className="flex gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 font-bold text-primary-300">
                  {s.n}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{s.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-surface-300">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="sticky top-24">
            <div data-cursor="view" data-cursor-label="Drag">
              <TiltCard initial={{ x: -8, y: 14 }} className="will-change-transform">
                <Reveal className="relative block rounded-3xl border border-white/10 bg-surface-900 p-5 shadow-2xl shadow-black/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary-500">
                    <TrackMark className="h-4 w-4 text-white" strokeWidth={2.2} />
                  </div>
                  <span className="text-sm font-semibold text-white">Your readiness</span>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-success-500/10 px-2.5 py-1 text-xs font-medium text-success-400">
                  <TrendingUp className="h-3.5 w-3.5" /> +12%
                </span>
              </div>

              <div className="mt-5">
                <div className="mb-1.5 flex items-end justify-between text-xs">
                  <span className="text-surface-400">Overall readiness</span>
                  <span className="font-bold text-white">82%</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-800">
                  <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-primary-500 to-accent-400" />
                </div>
              </div>

              <div className="mt-5 space-y-2.5">
                {[
                  { c: 'Google', s: 'OA cleared', t: 'success' },
                  { c: 'Amazon', s: 'Interview', t: 'primary' },
                  { c: 'Microsoft', s: 'Applied', t: 'muted' },
                ].map((row) => (
                  <div
                    key={row.c}
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-3.5 py-2.5"
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
              <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-surface-900 px-4 py-3 shadow-xl shadow-black/40">
                <CheckCircle2 className="h-5 w-5 text-success-400" />
                <div className="leading-tight">
                  <p className="text-xs font-semibold text-white">3 offers</p>
                  <p className="text-[10px] text-surface-400">this season</p>
                </div>
              </div>
            </Parallax>

            <Parallax speed={0.3} className="absolute -left-5 bottom-10 hidden sm:block">
              <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-surface-900 px-4 py-3 shadow-xl shadow-black/40">
                <ArrowUpRight className="h-5 w-5 text-accent-400" />
                <div className="leading-tight">
                  <p className="text-xs font-semibold text-white">+5 experiences</p>
                  <p className="text-[10px] text-surface-400">logged this week</p>
                </div>
              </div>
            </Parallax>
          </div>
        </div>
      </div>
    </section>
  );
}
