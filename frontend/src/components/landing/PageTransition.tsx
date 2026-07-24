import { useEffect, useState } from 'react';
import { useLocation, useNavigation, useNavigationType, type LinkProps } from 'react-router-dom';
import { useCallback } from 'react';

/**
 * PageTransition component - wraps the app and handles smooth page transitions
 * Uses the CSS classes defined in index.css (.page-transition, .page-transition.is-cover, .page-transition.is-reveal)
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigation = useNavigation();
  const navigationType = useNavigationType();
  const [transitionState, setTransitionState] = useState<'idle' | 'covering' | 'revealing'>('idle');
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Handle initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Handle navigation transitions
  useEffect(() => {
    // Skip transition on initial load
    if (isInitialLoad) return;

    // Only transition on PUSH/REPLACE navigations, not POP (back/forward)
    if (navigationType === 'POP') return;

    // Trigger cover animation
    setTransitionState('covering');

    // Wait for cover animation to complete (520ms per CSS)
    const coverTimer = setTimeout(() => {
      setTransitionState('revealing');

      // Clean up after reveal (560ms per CSS)
      const revealTimer = setTimeout(() => {
        setTransitionState('idle');
      }, 600);

      return () => clearTimeout(revealTimer);
    }, 550);

    return () => clearTimeout(coverTimer);
  }, [location.pathname, isInitialLoad, navigationType]);

  // Also handle form submissions / data loading
  useEffect(() => {
    if (navigation.state === 'loading' && !isInitialLoad) {
      setTransitionState('covering');
    } else if (navigation.state === 'idle' && transitionState === 'covering') {
      const timer = setTimeout(() => {
        setTransitionState('revealing');
        const revealTimer = setTimeout(() => {
          setTransitionState('idle');
        }, 600);
        return () => clearTimeout(revealTimer);
      }, 550);
      return () => clearTimeout(timer);
    }
  }, [navigation.state, isInitialLoad, transitionState]);

  return (
    <>
      {/* Page transition overlay */}
      <div
        className={`page-transition fixed inset-0 z-[9999] pointer-events-none ${
          transitionState === 'covering' ? 'is-cover' : ''
        } ${transitionState === 'revealing' ? 'is-reveal' : ''}`}
        aria-hidden="true"
      />

      {/* Main content */}
      <main id="main-content" className="relative z-10">
        {children}
      </main>
    </>
  );
}

/**
 * Link wrapper that triggers page transition on click
 */
export function TransitionLink({ children, to, onClick, ...props }: LinkProps) {
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Don't interfere with modifier keys or new tab
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
        return;
      }

      // Prevent default to allow transition
      e.preventDefault();

      // Get the href string from the to prop
      const href = typeof to === 'string' ? to : String(to);

      // Trigger transition immediately
      // The router will handle navigation after
      window.history.pushState(null, '', href);
      window.dispatchEvent(new PopStateEvent('popstate'));

      // Call original onClick if provided
      onClick?.(e);
    },
    [to, onClick]
  );

  return <a href={typeof to === 'string' ? to : String(to)} onClick={handleClick} {...props}>{children}</a>;
}