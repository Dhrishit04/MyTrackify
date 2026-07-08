// ============================================
// StatCard Component — Animated stat display
// ============================================

import { useEffect, useState, type ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  trend?: { value: number; label: string };
  suffix?: string;
  color?: 'primary' | 'accent' | 'success' | 'warning' | 'danger';
  delay?: number;
}

export default function StatCard({ title, value, icon, trend, suffix = '', color = 'primary', delay = 0 }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const numericValue = typeof value === 'number' ? value : 0;

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!isVisible || typeof value !== 'number') return;

    const duration = 1000;
    const steps = 30;
    const stepValue = numericValue / steps;
    let current = 0;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      current = Math.min(stepValue * step, numericValue);
      setDisplayValue(Math.round(current * 10) / 10);
      if (step >= steps) clearInterval(interval);
    }, duration / steps);

    return () => clearInterval(interval);
  }, [isVisible, numericValue, value]);

  const colorMap = {
    primary: 'from-primary-500/20 to-primary-600/5 border-primary-500/20',
    accent: 'from-accent-500/20 to-accent-600/5 border-accent-500/20',
    success: 'from-success-500/20 to-success-600/5 border-success-500/20',
    warning: 'from-warning-500/20 to-warning-500/5 border-warning-500/20',
    danger: 'from-danger-500/20 to-danger-500/5 border-danger-500/20',
  };

  const iconColorMap = {
    primary: 'text-primary-400',
    accent: 'text-accent-400',
    success: 'text-success-400',
    warning: 'text-warning-400',
    danger: 'text-danger-400',
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${colorMap[color]} border p-5 card-hover transition-all duration-500 min-h-[120px] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
    >
      {/* Background glow */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${colorMap[color]} opacity-30 blur-3xl`} />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-surface-300 font-medium">{title}</span>
          <div className={`${iconColorMap[color]}`}>{icon}</div>
        </div>

        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-bold text-white tabular-nums">
            {typeof value === 'number' ? displayValue : value}
          </span>
          {suffix && <span className="text-sm text-surface-400">{suffix}</span>}
        </div>

        {trend && (
          <div className="flex items-center gap-1.5 mt-2">
            {trend.value > 0 ? (
              <TrendingUp className="w-3.5 h-3.5 text-success-400" />
            ) : trend.value < 0 ? (
              <TrendingDown className="w-3.5 h-3.5 text-danger-400" />
            ) : (
              <Minus className="w-3.5 h-3.5 text-surface-400" />
            )}
            <span className={`text-xs font-medium ${
              trend.value > 0 ? 'text-success-400' : trend.value < 0 ? 'text-danger-400' : 'text-surface-400'
            }`}>
              {trend.value > 0 ? '+' : ''}{trend.value}% {trend.label}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
