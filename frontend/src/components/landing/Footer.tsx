import { useLenis } from 'lenis/react';
import { Sparkles } from 'lucide-react';
import { TransitionLink } from '../transition/TransitionProvider';

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'How it works', href: '#showcase' },
      { label: 'Stats', href: '#stats' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Log in', href: '/login' },
      { label: 'Create account', href: '/register' },
    ],
  },
];

export default function Footer() {
  const lenis = useLenis();

  const handleHash = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const t = document.querySelector(href);
    if (t) lenis?.scrollTo(t as HTMLElement, { offset: -88 });
  };

  return (
    <footer className="border-t border-white/5 px-4 py-12 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary-500">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">MyTrackify</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-surface-400">
            Campus placement intelligence — keeping every interview story, company process, and
            readiness insight from vanishing when seniors graduate.
          </p>
        </div>

        <div className="flex gap-16">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-semibold uppercase tracking-wider text-surface-500">
                {col.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.href.startsWith('/') ? (
                      <TransitionLink
                        to={l.href}
                        className="text-sm text-surface-300 transition-colors hover:text-white"
                      >
                        {l.label}
                      </TransitionLink>
                    ) : (
                      <a
                        href={l.href}
                        onClick={(e) => handleHash(e, l.href)}
                        className="text-sm text-surface-300 transition-colors hover:text-white"
                      >
                        {l.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-white/5 pt-6 text-center text-xs text-surface-500">
        © {new Date().getFullYear()} MyTrackify. Built for students, by students.
      </div>
    </footer>
  );
}
