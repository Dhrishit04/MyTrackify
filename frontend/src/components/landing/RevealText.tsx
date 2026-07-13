import { useEffect, useRef, useState, type ElementType } from 'react';

interface Props {
  text: string;
  as?: ElementType;
  className?: string;
  gradient?: boolean;
  delay?: number;
  stagger?: number;
  threshold?: number;
}

export default function RevealText({
  text,
  as: Tag = 'p',
  className = '',
  gradient = false,
  delay = 0,
  stagger = 45,
  threshold = 0.2,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          o.disconnect();
        }
      },
      { threshold }
    );
    o.observe(el);
    return () => o.disconnect();
  }, [threshold]);

  const words = text.split(' ');

  return (
    <Tag ref={ref as never} className={`reveal-text font-display ${shown ? 'is-visible' : ''} ${className}`} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="reveal-word">
          <span className={gradient ? 'text-gradient' : ''} style={{ transitionDelay: `${delay + i * stagger}ms` }}>
            {w}
            {' '}
          </span>
        </span>
      ))}
    </Tag>
  );
}
