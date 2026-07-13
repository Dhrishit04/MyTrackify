import { ArrowRight, Sparkles } from 'lucide-react';
import Reveal from './Reveal';
import RevealText from './RevealText';
import MagneticLink from './MagneticLink';

export default function CTA() {
  return (
    <section className="relative px-4 py-24 sm:px-6">
      <Reveal className="mx-auto max-w-5xl">
        <div className="border-glow relative overflow-hidden rounded-3xl border border-white/10 bg-surface-900 px-6 py-16 text-center shadow-2xl shadow-black/40 sm:px-12">
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                'radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.16) 0%, transparent 60%)',
            }}
          />
          <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-primary-500/20 blur-[100px]" />

          <div className="relative z-10 mx-auto max-w-2xl">
            <div className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-primary-500 shadow-lg shadow-primary-500/25">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <RevealText
              as="h2"
              className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl"
              text="Start your placement edge today"
            />
            <p className="mx-auto mt-4 max-w-xl text-base text-surface-300">
              Join the students turning shared interview experience into offers. It takes a minute
              to begin — and the whole campus benefits.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <MagneticLink
                to="/login"
                strength={0.4}
                className="group inline-flex items-center gap-2 rounded-xl bg-primary-600 px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-primary-600/25 transition-all duration-300 hover:bg-primary-500 hover:shadow-primary-500/40"
              >
                Log in to MyTrackify
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </MagneticLink>
              <MagneticLink
                to="/register"
                strength={0.4}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 text-sm font-semibold text-surface-100 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/10"
              >
                Create free account
              </MagneticLink>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
