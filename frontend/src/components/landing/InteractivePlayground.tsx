import { Hand } from 'lucide-react';
import KineticText from './KineticText';
import LiquidGlassToggle from './LiquidGlassToggle';
import GravityCanvas from './GravityCanvas';
import Reveal from './Reveal';

export default function InteractivePlayground() {
  return (
    <section id="playground" className="relative overflow-hidden px-4 py-24 sm:px-6">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse at 30% 20%, rgba(245,158,11,0.10) 0%, transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(245,158,11,0.06) 0%, transparent 50%)',
        }}
      />

      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
        <div className="order-2 lg:order-1">
          <Reveal>
            <span className="inline-block rounded-full border border-primary-400/20 bg-primary-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-300">
              Feel the motion
            </span>
          </Reveal>
          <Reveal>
            <KineticText
              as="h2"
              text="Motion that makes it stick"
              className="mt-4 block text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl"
            />
          </Reveal>
          <Reveal>
            <p className="mt-4 max-w-md text-base text-surface-300">
              Hover the headline, slide the glass, then fling the badges — every interaction is built
              to make placement prep feel alive.
            </p>
          </Reveal>

          <Reveal className="mt-10">
            <LiquidGlassToggle />
          </Reveal>
        </div>

        <Reveal className="order-1 lg:order-2">
          <div className="relative">
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-surface-900/50 shadow-2xl shadow-black/40 backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/5 px-5 py-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-surface-400">
                  Gravity playground
                </span>
                <span className="flex items-center gap-1.5 text-xs text-surface-500">
                  <Hand className="h-3.5 w-3.5" /> drag &amp; fling
                </span>
              </div>
              <GravityCanvas className="h-[420px] w-full" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
