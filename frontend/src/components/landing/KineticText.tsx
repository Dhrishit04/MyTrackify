import type { ElementType } from 'react';

interface Props {
  text: string;
  className?: string;
  as?: ElementType;
}

export default function KineticText({ text, className = '', as: Tag = 'span' }: Props) {
  const letters = Array.from(text);
  return (
    <Tag className={`kinetic ${className}`}>
      {letters.map((c, i) => (
        <span key={i} className="kinetic-letter" style={{ transitionDelay: `${i * 22}ms` }}>
          {c === ' ' ? ' ' : c}
        </span>
      ))}
    </Tag>
  );
}
