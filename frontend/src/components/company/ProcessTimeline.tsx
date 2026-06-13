// ============================================
// ProcessTimeline Component
// ============================================

import { Clock, Users, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { ProcessRound } from '../../types';

interface ProcessTimelineProps {
  rounds: ProcessRound[];
  verifiedCount: number;
}

export default function ProcessTimeline({ rounds, verifiedCount }: ProcessTimelineProps) {
  const getDifficultyColor = (rate: number) => {
    if (rate >= 60) return 'text-danger-400';
    if (rate >= 40) return 'text-warning-400';
    return 'text-success-400';
  };

  const getBarColor = (rate: number) => {
    if (rate >= 60) return 'bg-danger-500';
    if (rate >= 40) return 'bg-warning-500';
    return 'bg-success-500';
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-white">Interview Process</h3>
        <div className="flex items-center gap-1.5 text-xs text-accent-400">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Verified by {verifiedCount} students
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-primary-500/50 via-primary-500/20 to-transparent" />

        {rounds.map((round, index) => (
          <div key={round.roundNumber} className="relative flex gap-4 pb-6 last:pb-0 animate-slide-up" style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'both' }}>
            {/* Node */}
            <div className="relative z-10 flex-shrink-0">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold
                ${index === 0 ? 'bg-primary-600 text-white glow-primary' : 'bg-surface-700 text-surface-200 border border-white/10'}`}>
                R{round.roundNumber}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 glass rounded-xl p-4 group hover:border-primary-500/30 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-white">{round.roundType}</h4>
                <div className="flex items-center gap-1.5 text-xs text-surface-300">
                  <Clock className="w-3.5 h-3.5" />
                  {round.durationMinutes} min
                </div>
              </div>

              {/* Topics */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {round.topics.map((topic) => (
                  <span key={topic} className="text-xs px-2 py-0.5 bg-primary-500/10 text-primary-300 rounded-md border border-primary-500/20">
                    {topic}
                  </span>
                ))}
              </div>

              {/* Elimination Rate */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className={`w-3.5 h-3.5 ${getDifficultyColor(round.avgEliminationRate)}`} />
                  <span className={`text-sm font-medium ${getDifficultyColor(round.avgEliminationRate)}`}>
                    {round.avgEliminationRate}% eliminated
                  </span>
                </div>
                <div className="flex-1 h-1.5 bg-surface-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getBarColor(round.avgEliminationRate)} rounded-full transition-all duration-700`}
                    style={{ width: `${round.avgEliminationRate}%` }}
                  />
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-surface-400" />
                  <span className="text-xs text-surface-400">
                    ~{Math.round(100 - round.avgEliminationRate)}% pass
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
