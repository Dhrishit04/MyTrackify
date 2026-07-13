interface BadgeProps {
  variant: 'selected' | 'rejected' | 'in-progress' | 'withdrew' | 'passed' | 'failed' | 'pending' | 'verified' | 'sector';
  children: React.ReactNode;
  size?: 'sm' | 'md';
}

export default function Badge({ variant, children, size = 'sm' }: BadgeProps) {
  const baseClasses = `inline-flex items-center font-medium rounded-full ${
    size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
  }`;

  const variantClasses: Record<string, string> = {
    selected: 'badge-selected',
    passed: 'badge-selected',
    rejected: 'badge-rejected',
    failed: 'badge-rejected',
    'in-progress': 'badge-in-progress',
    pending: 'badge-in-progress',
    withdrew: 'badge-withdrew',
    verified: 'bg-accent-500/15 text-accent-400 border border-accent-500/30',
    sector: 'bg-surface-700/50 text-surface-200 border border-surface-600/50',
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant] || variantClasses.sector}`}>
      {children}
    </span>
  );
}
