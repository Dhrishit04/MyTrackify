import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigation } from 'react-router-dom';

/**
 * Page transition hook using the CSS classes defined in index.css
 * Provides smooth page transitions with a sweep animation
 */
export function usePageTransition() {
  const location = useLocation();
  const navigation = useNavigation();
  const [transitionState, setTransitionState] = useState<'idle' | 'covering' | 'revealing'>('idle');
  const previousPathRef = useRef(location.pathname);

  useEffect(() => {
    // Only trigger on actual navigation, not initial load
    if (previousPathRef.current !== location.pathname) {
      // Start covering animation
      setTransitionState('covering');

      // Wait for cover animation to complete, then reveal
      const coverDuration = 520; // matches CSS transition duration

      const timeoutId = setTimeout(() => {
        setTransitionState('revealing');
        previousPathRef.current = location.pathname;

        // Clean up after reveal
        const revealTimeoutId = setTimeout(() => {
          setTransitionState('idle');
        }, 560); // matches CSS reveal duration

        return () => clearTimeout(revealTimeoutId);
      }, coverDuration);

      return () => clearTimeout(timeoutId);
    }
  }, [location.pathname]);

  // Also handle form submissions / data loading
  useEffect(() => {
    if (navigation.state === 'loading' && transitionState === 'idle') {
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
  }, [navigation.state, transitionState]);

  return transitionState;
}