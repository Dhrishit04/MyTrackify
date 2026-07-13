import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Stagger delay in ms */
  delay?: number;
  threshold?: number;
  once?: boolean;
}

export default function Reveal({
  children,
  as: Tag = 'div',
  className = '',
  delay = 0,
  threshold = 0.15,
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) obs.unobserve(el);
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, once]);

  return (
    <Tag
      ref={ref as never}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ ['--reveal-delay' as string]: `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}
