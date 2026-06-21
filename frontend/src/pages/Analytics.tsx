// ============================================
// Analytics Page — Readiness & Insights
// ============================================

import { useEffect, useState } from 'react';
import { BarChart3, Target, TrendingUp, AlertTriangle, CheckCircle2, Clock, ChevronDown } from 'lucide-react';
import SkillRadar from '../components/analytics/SkillRadar';
import { analyticsService } from '../services/analyticsService';
import { companies } from '../services/mockData';
import type { ReadinessAnalysis } from '../types';

export default function Analytics() {
  const [readiness, setReadiness] = useState<ReadinessAnalysis | null>(null);
  const [selectedCompany, setSelectedCompany] = useState(1);
  const [isLoadingReadiness, setIsLoadingReadiness] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchReadiness = async () => {
      const data = await analyticsService.getReadiness(selectedCompany);
      if (!cancelled) {
        setReadiness(data);
        setIsLoadingReadiness(false);
      }
    };
    fetchReadiness();
    return () => { cancelled = true; };
  }, [selectedCompany]);

  const companyName = companies.find(c => c.id === selectedCompany)?.name || 'Unknown';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMFORTABLE': return 'text-success-400';
      case 'MODERATE': return 'text-warning-400';
      case 'TIGHT': return 'text-danger-400';
      default: return 'text-surface-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMFORTABLE': return <CheckCircle2 className="w-5 h-5" />;
      case 'MODERATE': return <Clock className="w-5 h-5" />;
      case 'TIGHT': return <AlertTriangle className="w-5 h-5" />;
      default: return null;
    }
  };

  const skillRadarData = readiness ? [
    ...(readiness.yourStrengths.map(s => ({
      subject: s.topic,
      you: s.yourScore,
      target: s.targetScore,
      fullMark: 10,
    }))),
    ...(readiness.focusAreas.map(f => ({
      subject: f.topic,
      you: f.yourScore,
      target: f.targetScore,
      fullMark: 10,
    }))),
  ] : [];

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary-400" />
            Readiness Analytics
          </h1>
          <p className="text-surface-400 mt-1">Compare your profile against students who cracked target companies</p>
        </div>

        {/* Company Selector */}
        <div className="relative">
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(parseInt(e.target.value))}
            className="input-dark pl-4 pr-10 py-2.5 rounded-xl text-sm font-medium appearance-none cursor-pointer min-w-[200px]"
            id="analytics-company-select"
          >
            {companies.filter(c => ['Product', 'Trading'].includes(c.sector)).map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
        </div>
      </div>

      {isLoadingReadiness ? (
        <div className="space-y-6">
          <div className="h-40 rounded-2xl shimmer" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80 rounded-2xl shimmer" />
            <div className="h-80 rounded-2xl shimmer" />
          </div>
        </div>
      ) : readiness && (
        <>
          {/* Readiness Summary */}
          <div className="glass rounded-2xl p-6 border border-white/5">
            <h2 className="text-lg font-semibold text-white mb-2">
              Readiness for: <span className="text-gradient">{companyName}</span>
            </h2>
            <p className="text-sm text-surface-400 mb-6">
              Based on {readiness.similarStudentsCount} students similar to your profile
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Your Cohort Success Rate */}
              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-3">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(99,102,241,0.1)" strokeWidth="12" />
                    <circle cx="60" cy="60" r="52" fill="none" stroke="url(#gaugeGradient)" strokeWidth="12" strokeLinecap="round"
                      strokeDasharray={`${(readiness.similarStudentsSuccessRate / 100) * 327} 327`} />
                    <defs>
                      <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#22d3ee" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-white">{readiness.similarStudentsSuccessRate}%</span>
                    <span className="text-xs text-surface-400">Success</span>
                  </div>
                </div>
                <p className="text-sm text-surface-300">
                  vs overall <span className="font-medium text-surface-100">{readiness.overallSuccessRate}%</span>
                  {readiness.similarStudentsSuccessRate > readiness.overallSuccessRate && (
                    <span className="text-success-400 ml-1">— Above average!</span>
                  )}
                </p>
              </div>

              {/* Timeline */}
              <div className="flex flex-col items-center justify-center">
                <div className={`flex items-center gap-2 mb-2 ${getStatusColor(readiness.timeline.status)}`}>
                  {getStatusIcon(readiness.timeline.status)}
                  <span className="text-lg font-bold uppercase">{readiness.timeline.status}</span>
                </div>
                <p className="text-sm text-surface-300 text-center">
                  Successful students started <span className="text-white font-medium">{readiness.timeline.avgPrepWeeks} weeks</span> before.
                  Company visits in <span className="text-white font-medium">{readiness.timeline.companyVisitInWeeks} weeks</span>.
                </p>
              </div>

              {/* Quick Stats */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-surface-800/30">
                  <span className="text-xs text-surface-400">Similar Students</span>
                  <span className="text-sm font-bold text-white">{readiness.similarStudentsCount}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-surface-800/30">
                  <span className="text-xs text-surface-400">Strengths</span>
                  <span className="text-sm font-bold text-success-400">{readiness.yourStrengths.length}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-surface-800/30">
                  <span className="text-xs text-surface-400">Focus Areas</span>
                  <span className="text-sm font-bold text-warning-400">{readiness.focusAreas.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Skill Radar + Focus Areas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SkillRadar data={skillRadarData} title="Skill Comparison" />

            <div className="space-y-4">
              {/* Strengths */}
              <div className="glass rounded-2xl p-5 border border-white/5">
                <h3 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success-400" />
                  Your Strengths
                </h3>
                <div className="space-y-2">
                  {readiness.yourStrengths.map((strength) => (
                    <div key={strength.topic} className="flex items-center justify-between p-3 rounded-xl bg-success-500/5 border border-success-500/10">
                      <div>
                        <p className="text-sm font-medium text-surface-100">{strength.topic}</p>
                        <p className="text-xs text-surface-400">Target: {strength.targetScore}/10</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-success-400">{strength.yourScore}/10</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Focus Areas */}
              <div className="glass rounded-2xl p-5 border border-white/5">
                <h3 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-warning-400" />
                  Recommended Focus Areas
                </h3>
                <div className="space-y-3">
                  {readiness.focusAreas.map((area) => (
                    <div key={area.topic} className="p-3 rounded-xl bg-warning-500/5 border border-warning-500/10">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-surface-100">{area.topic}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-warning-400">{area.yourScore}/10</span>
                          <TrendingUp className="w-3 h-3 text-surface-500" />
                          <span className="text-sm text-success-400">{area.targetScore}/10</span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-surface-800 rounded-full overflow-hidden mb-2">
                        <div className="h-full bg-gradient-to-r from-warning-500 to-success-500 rounded-full" style={{ width: `${(area.yourScore / area.targetScore) * 100}%` }} />
                      </div>
                      <p className="text-xs text-surface-400">{area.recommendation}</p>
                      <p className="text-xs text-primary-400 mt-1">{area.prevalence}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
