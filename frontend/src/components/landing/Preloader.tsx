import { useEffect, useState } from 'react';

export default function Preloader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let p = 0;
    const id = setInterval(() => {
      p = Math.min(100, p + Math.random() * 14 + 6);
      setProgress(Math.round(p));
      if (p >= 100) {
        clearInterval(id);
        window.setTimeout(() => setDone(true), 350);
        window.setTimeout(onDone, 350 + 720);
      }
    }, 130);
    return () => clearInterval(id);
  }, [onDone]);

  return (
    <div className={`preloader ${done ? 'preloader--done' : ''}`} aria-hidden={done}>
      <svg className="preloader__logo" viewBox="0 0 64 64" fill="none" width={64} height={64}>
        <rect
          x="6"
          y="6"
          width="52"
          height="52"
          rx="14"
          stroke="url(#pl-g)"
          strokeWidth="3"
          pathLength={1}
          className="preloader__stroke"
        />
        <path
          d="M22 41 L32 20 L42 41 M27.5 33 H36.5"
          stroke="url(#pl-g)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          className="preloader__stroke"
        />
        <defs>
          <linearGradient id="pl-g" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f59e0b" />
            <stop offset="1" stopColor="#fcd34d" />
          </linearGradient>
        </defs>
      </svg>
      <div className="preloader__bar">
        <div className="preloader__fill" style={{ width: `${progress}%` }} />
      </div>
      <p className="preloader__pct">{progress}%</p>

      <div className="mt-2 w-[min(280px,70vw)] space-y-2.5">
        <div className="shimmer h-2.5 w-2/3 rounded-full" />
        <div className="shimmer h-2.5 w-full rounded-full" />
        <div className="shimmer h-2.5 w-5/6 rounded-full" />
        <div className="shimmer h-20 w-full rounded-2xl" />
      </div>
    </div>
  );
}
