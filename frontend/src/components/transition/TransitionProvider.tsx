import { createContext, forwardRef, useContext, useEffect, useRef, useState, type ReactNode, type AnchorHTMLAttributes } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

type TransitionCtx = { navigate: (to: string) => void };
const Ctx = createContext<TransitionCtx>({ navigate: () => {} });

export const useTransitionNavigate = () => useContext(Ctx).navigate;

const COVER_MS = 520;
const REVEAL_MS = 560;

type Phase = 'idle' | 'cover' | 'reveal';

export function TransitionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [phase, setPhase] = useState<Phase>('idle');
  const busy = useRef(false);

  const go = (to: string) => {
    if (busy.current || to === location.pathname) return;
    busy.current = true;
    setPhase('cover');

    window.setTimeout(() => {
      navigate(to);
      window.scrollTo(0, 0);
      setPhase('reveal');
      window.setTimeout(() => {
        setPhase('idle');
        busy.current = false;
      }, REVEAL_MS);
    }, COVER_MS);
  };

  return (
    <Ctx.Provider value={{ navigate: go }}>
      {children}
      <div
        className={`page-transition ${phase === 'cover' ? 'is-cover' : ''} ${
          phase === 'reveal' ? 'is-reveal' : ''
        }`}
        aria-hidden
      />
    </Ctx.Provider>
  );
}

interface TransitionLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to: string;
  'data-cursor'?: string;
  'data-cursor-label'?: string;
}

export const TransitionLink = forwardRef<HTMLAnchorElement, TransitionLinkProps>(
  ({ to, onClick, children, ...rest }, ref) => {
    const go = useTransitionNavigate();
    return (
      <Link
        ref={ref}
        to={to}
        onClick={(e) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
          e.preventDefault();
          onClick?.(e);
          go(to);
        }}
        {...rest}
      >
        {children}
      </Link>
    );
  }
);
TransitionLink.displayName = 'TransitionLink';

/** Keeps the transition overlay in sync if the user navigates via back/forward. */
export function TransitionSync() {
  const location = useLocation();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const el = document.querySelector('.page-transition');
    if (el) {
      el.classList.remove('is-cover', 'is-reveal');
    }
  }, [location.pathname]);
  return null;
}
