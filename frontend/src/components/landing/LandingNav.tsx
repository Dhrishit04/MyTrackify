import { useEffect, useRef, useState } from 'react';
import { useLenis } from 'lenis/react';
import { Sparkles, ArrowRight, Menu, X, Search } from 'lucide-react';
import { TransitionLink } from '../transition/TransitionProvider';
import MagneticLink from './MagneticLink';

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#showcase' },
  { label: 'Stats', href: '#stats' },
];

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [visible, setVisible] = useState(false);
  const [logoBounce, setLogoBounce] = useState(false);
  const prevScrolled = useRef(false);
  const lenis = useLenis();
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  // Cinematic nav entrance after preloader
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  useLenis((l) => {
    const y = l.scroll;
    const nowScrolled = y > 24;
    setScrolled((prev) => {
      if (prev !== nowScrolled && nowScrolled && !prevScrolled.current) {
        // Trigger logo bounce on scroll-up toggle
        setLogoBounce(true);
        setTimeout(() => setLogoBounce(false), 500);
      }
      prevScrolled.current = nowScrolled;
      return nowScrolled;
    });
  });

  const handleNav = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) lenis?.scrollTo(target as HTMLElement, { offset: -88 });
    setOpen(false);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ${
        visible ? 'nav-visible' : 'nav-hidden'
      } ${scrolled ? 'py-2.5' : 'py-5'}`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 transition-all duration-500 ${
          scrolled
            ? 'rounded-2xl border border-white/10 bg-surface-950/70 px-4 py-2.5 shadow-xl shadow-black/30 backdrop-blur-xl sm:px-6'
            : 'border border-transparent bg-transparent'
        }`}
      >
        {/* Logo */}
        <a href="#top" onClick={(e) => handleNav(e, '#top')} className="flex items-center gap-2.5 group">
          <div className={`relative grid h-9 w-9 place-items-center rounded-xl bg-primary-500 shadow-lg shadow-primary-500/25 transition-transform duration-300 group-hover:scale-105 ${logoBounce ? 'logo-bounce' : ''}`}>
            <Sparkles className="h-5 w-5 text-white" strokeWidth={2.2} />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">MyTrackify</span>
        </a>

        {/* Desktop links */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNav(e, link.href)}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-surface-300 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2.5">
          {/* Dynamic search reveal */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const t = document.querySelector('#features');
              if (t) lenis?.scrollTo(t as HTMLElement, { offset: -88 });
              setSearchOpen(false);
              setSearch('');
            }}
            className="hidden items-center md:flex"
          >
            <button
              type="button"
              onClick={() => setSearchOpen((o) => !o)}
              aria-label="Search features"
              aria-expanded={searchOpen}
              className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-surface-200 transition-colors hover:border-white/20 hover:text-white"
            >
              <Search className="h-4 w-4" />
            </button>
            <div className={`nav-search ${searchOpen ? 'is-open' : ''}`}>
              <input
                ref={searchRef}
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onBlur={() => {
                  if (!search) setSearchOpen(false);
                }}
                placeholder="Search features…"
                aria-label="Search features"
              />
            </div>
          </form>

          <TransitionLink
            to="/login"
            className="hidden rounded-lg px-3.5 py-2 text-sm font-semibold text-surface-200 transition-colors hover:text-white sm:inline-flex"
          >
            Log in
          </TransitionLink>
          <MagneticLink
            to="/login"
            strength={0.4}
            className="group inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition-all duration-300 hover:bg-primary-500 hover:shadow-primary-500/40"
          >
            Get started
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </MagneticLink>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-surface-200 md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="mx-4 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-surface-950/90 p-2 backdrop-blur-xl md:hidden">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNav(e, link.href)}
              className="block rounded-lg px-4 py-2.5 text-sm font-medium text-surface-200 transition-colors hover:bg-white/5 hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <TransitionLink
            to="/login"
            onClick={() => setOpen(false)}
            className="mt-1 block rounded-lg bg-primary-600 px-4 py-2.5 text-center text-sm font-semibold text-white"
          >
            Log in
          </TransitionLink>
        </div>
      )}
    </header>
  );
}
