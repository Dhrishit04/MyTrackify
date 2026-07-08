// ============================================
// ExperienceCard Component
// ============================================

import { ThumbsUp, Star, Shield, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import Badge from '../common/Badge';
import type { InterviewExperience } from '../../types';

interface ExperienceCardProps {
  experience: InterviewExperience;
  index?: number;
}

export default function ExperienceCard({ experience, index = 0 }: ExperienceCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(experience.helpfulCount);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!liked) {
      setHelpfulCount(prev => prev + 1);
      setLiked(true);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3.5 h-3.5 ${i < rating ? 'star-filled fill-current' : 'star-empty'}`}
      />
    ));
  };

  const outcomeVariant = experience.outcome?.toLowerCase() === 'passed' ? 'passed' :
    experience.outcome?.toLowerCase() === 'failed' ? 'failed' : 'pending';

  return (
    <div
      className="glass rounded-xl p-5 card-hover animate-slide-up border border-white/5 hover:border-primary-500/20"
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-surface-700 flex items-center justify-center text-xs font-semibold text-primary-300">
            {experience.studentAnonymizedId?.slice(-4) || 'ANON'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-surface-100">
                {experience.studentAnonymizedId}
              </span>
              {experience.verified && (
                <div className="flex items-center gap-0.5 text-accent-400" title="Verified experience">
                  <Shield className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-surface-400">
              <span>Round {experience.roundNumber} · {experience.roundType}</span>
              <span>•</span>
              <Calendar className="w-3 h-3" />
              <span>{new Date(experience.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={outcomeVariant}>{experience.outcome}</Badge>
          <div className="flex items-center gap-0.5">
            {renderStars(experience.difficultyRating)}
          </div>
        </div>
      </div>

      {/* Topics */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {experience.topics.map((topic) => (
          <span key={topic} className="text-xs px-2 py-0.5 bg-primary-500/10 text-primary-300 rounded-md">
            {topic}
          </span>
        ))}
      </div>

      {/* Questions Preview / Full */}
      <div className="mb-3">
        <p className="text-sm text-surface-200 leading-relaxed whitespace-pre-line break-words overflow-wrap-anywhere">
          {expanded ? experience.questionsAsked : experience.questionsAsked.slice(0, 200) + (experience.questionsAsked.length > 200 ? '...' : '')}
        </p>
      </div>

      {/* Tips */}
      {expanded && experience.preparationTips && (
        <div className="mb-3 p-3 rounded-lg bg-success-500/5 border border-success-500/15">
          <p className="text-xs font-semibold text-success-400 mb-1">💡 Preparation Tips</p>
          <p className="text-sm text-surface-200 leading-relaxed">{experience.preparationTips}</p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all ${
            liked
              ? 'bg-primary-500/20 text-primary-300'
              : 'hover:bg-surface-700/50 text-surface-400 hover:text-surface-200'
          }`}
          id={`upvote-exp-${experience.id}`}
        >
          <ThumbsUp className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
          <span className="font-medium">{helpfulCount}</span>
          <span className="text-xs">Helpful</span>
        </button>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300 transition-colors"
        >
          {expanded ? (
            <>Show Less <ChevronUp className="w-3.5 h-3.5" /></>
          ) : (
            <>Read More <ChevronDown className="w-3.5 h-3.5" /></>
          )}
        </button>
      </div>
    </div>
  );
}
