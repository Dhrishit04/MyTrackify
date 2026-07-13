import { useState } from 'react';
import { ReactLenis, useLenis } from 'lenis/react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import LandingNav from '../components/landing/LandingNav';
import Hero from '../components/landing/Hero';
import TrustedBy from '../components/landing/TrustedBy';
import Features from '../components/landing/Features';
import Showcase from '../components/landing/Showcase';
import Stats from '../components/landing/Stats';
import CTA from '../components/landing/CTA';
import Footer from '../components/landing/Footer';
import ScrollProgress from '../components/landing/ScrollProgress';
import Preloader from '../components/landing/Preloader';
import AnimatedSVG from '../components/landing/AnimatedSVG';
import KineticRibbon from '../components/landing/KineticRibbon';
import InteractivePlayground from '../components/landing/InteractivePlayground';
import RevealText from '../components/landing/RevealText';
import Reveal from '../components/landing/Reveal';
import { GraduationCap, Lock, Search, Users } from 'lucide-react';

/** Publishes the current scroll offset as a CSS var for parallax orbs. */
function ScrollBridge() {
  useLenis((lenis) => {
    document.documentElement.style.setProperty('--scroll', String(Math.round(lenis.scroll)));
  });
  return null;
}

const WHY_POINTS = [
  { icon: GraduationCap, text: 'Stays after seniors leave' },
  { icon: Users, text: 'Built by your own peers' },
  { icon: Search, text: 'Searchable in seconds' },
  { icon: Lock, text: 'Private to your campus' },
];

export default function Landing() {
  const reduced = useReducedMotion();
  const [loaded, setLoaded] = useState(
    () =>
      typeof window !== 'undefined' &&
      (reduced || !!sessionStorage.getItem('mt_loaded'))
  );

  const handleDone = () => {
    try {
      sessionStorage.setItem('mt_loaded', '1');
    } catch {
      /* ignore */
    }
    setLoaded(true);
  };

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        smoothWheel: !reduced,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
      }}
    >
      <ScrollBridge />
      {!loaded && <Preloader onDone={handleDone} />}
      <ScrollProgress />
      <LandingNav />

      <main className={`landing-main relative ${loaded ? 'is-ready' : ''}`}>
        <Hero />
        <TrustedBy />
        <Features />
        <Philosophy />
        <Showcase />
        <InteractivePlayground />
        <KineticRibbon />
        <Stats />
        <CTA />
      </main>

      <Footer />
    </ReactLenis>
  );
}

function Philosophy() {
  return (
    <section className="relative px-4 py-24 sm:px-6">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        <Reveal className="order-2 lg:order-1">
          <div className="rounded-3xl border border-white/10 bg-surface-900 p-6">
            <AnimatedSVG className="w-full" />
          </div>
        </Reveal>

        <div className="order-1 lg:order-2">
          <Reveal>
            <span className="inline-block rounded-full border border-primary-400/20 bg-primary-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-300">
              Why MyTrackify
            </span>
          </Reveal>
          <RevealText
            as="h2"
            className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl"
            text="Knowledge that used to graduate and disappear"
          />
          <Reveal>
            <p className="mt-4 text-base text-surface-300">
              Every senior takes their interview notes, referrals, and hard-won lessons with them.
              MyTrackify keeps that intelligence on campus — turning one-off experience into a system
              the next cohort builds on.
            </p>
          </Reveal>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {WHY_POINTS.map((p, i) => (
              <Reveal key={p.text} delay={i * 80} className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-500/10 text-primary-300 ring-1 ring-inset ring-primary-400/20">
                  <p.icon className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <span className="text-sm font-medium text-surface-200">{p.text}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
