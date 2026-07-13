import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  label: string;
  color: string;
}

const LABELS = [
  { label: 'Google', color: '#34d399' },
  { label: 'Amazon', color: '#2dd4bf' },
  { label: 'OA', color: '#10b981' },
  { label: 'Offer', color: '#14b8a6' },
  { label: 'Referral', color: '#34d399' },
  { label: 'Mentor', color: '#2dd4bf' },
  { label: 'Resume', color: '#10b981' },
];

export default function GravityCanvas({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let balls: Ball[] = [];
    let raf = 0;
    const mouse = { x: -9999, y: -9999, active: false };
    let dragIndex = -1;
    let last = { x: 0, y: 0, t: 0 };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (balls.length === 0) {
        balls = LABELS.map((l, i) => {
          const r2 = 32 + (i % 3) * 7;
          return {
            x: Math.random() * (w - r2 * 2) + r2,
            y: Math.random() * (h * 0.55) + r2,
            vx: (Math.random() - 0.5) * 2,
            vy: 0,
            r: r2,
            label: l.label,
            color: l.color,
          };
        });
      }
    };

    const step = () => {
      ctx.clearRect(0, 0, w, h);
      const g = 0.45;
      for (let i = 0; i < balls.length; i++) {
        const b = balls[i];
        if (i !== dragIndex) {
          b.vy += g;
          b.x += b.vx;
          b.y += b.vy;
          b.vx *= 0.995;

          if (mouse.active) {
            const dx = b.x - mouse.x;
            const dy = b.y - mouse.y;
            const d2 = dx * dx + dy * dy;
            const R = 120;
            if (d2 < R * R && d2 > 0.01) {
              const d = Math.sqrt(d2);
              const f = ((R - d) / R) * 1.4;
              b.vx += (dx / d) * f;
              b.vy += (dy / d) * f;
            }
          }

          if (b.x - b.r < 0) {
            b.x = b.r;
            b.vx = Math.abs(b.vx) * 0.8;
          }
          if (b.x + b.r > w) {
            b.x = w - b.r;
            b.vx = -Math.abs(b.vx) * 0.8;
          }
          if (b.y + b.r > h) {
            b.y = h - b.r;
            b.vy = -Math.abs(b.vy) * 0.72;
            b.vx *= 0.98;
          }
          if (b.y - b.r < 0) {
            b.y = b.r;
            b.vy = Math.abs(b.vy) * 0.8;
          }
        }

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(
          b.x - b.r * 0.3,
          b.y - b.r * 0.3,
          b.r * 0.1,
          b.x,
          b.y,
          b.r
        );
        grad.addColorStop(0, b.color);
        grad.addColorStop(1, 'rgba(6,14,20,0.92)');
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(255,255,255,0.10)';
        ctx.stroke();

        ctx.fillStyle = '#e2e8f0';
        ctx.font = `600 ${Math.max(11, b.r * 0.3)}px Inter, system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(b.label, b.x, b.y);
      }
      raf = requestAnimationFrame(step);
    };

    const getPos = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    const onDown = (e: PointerEvent) => {
      const p = getPos(e);
      dragIndex = balls.findIndex((b) => Math.hypot(b.x - p.x, b.y - p.y) <= b.r);
      if (dragIndex >= 0) {
        balls[dragIndex].vx = 0;
        balls[dragIndex].vy = 0;
        last = { x: p.x, y: p.y, t: performance.now() };
        canvas.setPointerCapture(e.pointerId);
      }
    };

    const onMove = (e: PointerEvent) => {
      const p = getPos(e);
      mouse.x = p.x;
      mouse.y = p.y;
      mouse.active = true;
      if (dragIndex >= 0) {
        const b = balls[dragIndex];
        const now = performance.now();
        const dt = Math.max(1, now - last.t);
        b.vx = ((p.x - last.x) / dt) * 16;
        b.vy = ((p.y - last.y) / dt) * 16;
        b.x = p.x;
        b.y = p.y;
        last = { x: p.x, y: p.y, t: now };
      }
    };

    const onUp = (e: PointerEvent) => {
      if (dragIndex >= 0) {
        dragIndex = -1;
        try {
          canvas.releasePointerCapture(e.pointerId);
        } catch {
          /* ignore */
        }
      }
      mouse.active = false;
    };

    const onLeave = () => {
      mouse.active = false;
      dragIndex = -1;
    };

    resize();
    window.addEventListener('resize', resize);
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointerleave', onLeave);

    if (reduced) {
      step();
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(step);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointerleave', onLeave);
    };
  }, [reduced]);

  return <canvas ref={canvasRef} className={`gravity-canvas ${className}`} aria-hidden />;
}
