import { useEffect, useRef, useState } from 'react';
import { BarChart3, Target, TrendingUp, AlertTriangle, CheckCircle2, Clock, ChevronDown, Sparkles } from 'lucide-react';
import SkillRadar from '../components/analytics/SkillRadar';
import { analyticsService } from '../services/analyticsService';
import { companies } from '../services/mockData';
import type { ReadinessAnalysis } from '../types';
import Reveal from '../components/landing/Reveal';
import RevealText from '../components/landing/RevealText';
import { useLenis } from 'lenis/react';

export default function Analytics() {
  const lenis = useLenis();
  const [readiness, setReadiness] = useState<ReadinessAnalysis | null>(null);
  const [selectedCompany, setSelectedCompany] = useState(1);
  const [isLoadingReadiness, setIsLoadingReadiness] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll for parallax effects
  useEffect(() => {
    if (!lenis) return;
    let rafId: number;
    const updateProgress = () => {
      const scrollY = lenis.scroll;
      const viewportHeight = window.innerHeight;
      const progress = Math.min(1, scrollY / (viewportHeight * 2));
      setScrollProgress(progress);
      rafId = requestAnimationFrame(updateProgress);
    };
    rafId = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(rafId);
  }, [lenis]);

  useEffect(() => {
    let cancelled = false;
    const fetchReadiness = async () => {
      setIsLoadingReadiness(true);
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
    <div ref={containerRef} className="space-y-6 animate-fade-in max-w-5xl mx-auto relative" style={{ willChange: 'transform' }}>
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-500/3 via-transparent to-accent-500/3 animate-pulse-soft" />
        <div className="absolute top-20 right-20 w-80 h-80 bg-primary-500/5 rounded-full blur-[150px] animate-float" style={{ transform: 'translateY(' + scrollProgress * 30 + 'px)' }} />
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-accent-500/5 rounded-full blur-[120px] animate-float" style={{ animationDelay: '3s', transform: 'translateY(' + scrollProgress * -30 + 'px)' }} />
      </div>

      {/* Header */}
      <Reveal delay={0} className="relative z-10" style={{ opacity: 0.3 + scrollProgress * 0.7, transform: 'translateY(' + 30 * (1 - scrollProgress) + 'px)' }}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <RevealText
              as="h1"
              className="text-2xl font-bold text-white flex items-center gap-2"
              text="Readiness Analytics"
              mode="words"
              stagger={40}
            />
            <BarChart3 className="w-6 h-6 text-primary-400 animate-float" />
            <p className="text-surface-400 mt-1 animate-fade-in" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>Compare your profile against students who cracked target companies</p>
          </div>

          {/* Company Selector */}
          <Reveal delay={200} className="animate-slide-in-right" style={{ animationFillMode: 'both' }}>
            <div className="relative group">
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(parseInt(e.target.value))}
                className="input-dark pl-4 pr-10 py-2.5 rounded-xl text-sm font-medium appearance-none cursor-pointer min-w-[200px] bg-surface-900/60"
                id="analytics-company-select"
              >
                {companies.filter(c => ['Product', 'Trading'].includes(c.sector)).map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none group-hover:text-primary-400 transition-colors" />
              <Sparkles className="absolute -top-2 -right-2 w-4 h-4 text-primary-400/50 animate-float opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Reveal>
        </div>
      </Reveal>

      {isLoadingReadiness ? (
        <Reveal delay={100} className="relative z-10">
          <div className="space-y-6">
            <div className="h-40 rounded-2xl shimmer animate-pulse-soft" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-80 rounded-2xl shimmer animate-pulse-soft" style={{ animationDelay: '100ms' }} />
              <div className="h-80 rounded-2xl shimmer animate-pulse-soft" style={{ animationDelay: '200ms' }} />
            </div>
          </div>
        </Reveal>
      ) : readiness && (
        <>
          {/* Readiness Summary */}
          <Reveal delay={100} className="relative z-10" style={{ opacity: 0.2 + scrollProgress * 0.8, transform: 'translateY(' + 20 * (1 - scrollProgress) + 'px)' }}>
            <div className="glass rounded-2xl p-6 border border-white/5 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <h2 className="text-lg font-semibold text-white mb-2 relative z-10 animate-slide-in-right">
                Readiness for: <span className="text-gradient">{companyName}</span>
              </h2>
              <p className="text-sm text-surface-400 mb-6 relative z-10 animate-fade-in" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
                Based on {readiness.similarStudentsCount} students similar to your profile
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                {/* Your Cohort Success Rate */}
                <Reveal delay={0} className="text-center animate-scale-in" style={{ animationFillMode: 'both' }}>
                  <div className="relative w-32 h-32 mx-auto mb-3 group">
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
                      <span className="text-3xl font-bold text-white animate-count-up">{readiness.similarStudentsSuccessRate}%</span>
                      <span className="text-xs text-surface-400">Success</span>
                    </div>
                  </div>
                  <p className="text-sm text-surface-300">
                    vs overall <span className="font-medium text-surface-100">{readiness.overallSuccessRate}%</span>
                    {readiness.similarStudentsSuccessRate > readiness.overallSuccessRate && (
                      <span className="text-success-400 ml-1 flex items-center gap-0.5 animate-bounce-gentle">— Above average! <TrendingUp className="w-3 h-3" /></span>
                    )}
                  </p>
                </Reveal>

                {/* Timeline */}
                <Reveal delay={80} className="flex flex-col items-center justify-center animate-slide-up" style={{ animationFillMode: 'both' }}>
                  <div className={`flex items-center gap-2 mb-2 ${getStatusColor(readiness.timeline.status)} animate-fade-in`}>
                    {getStatusIcon(readiness.timeline.status)}
                    <span className="text-lg font-bold uppercase">{readiness.timeline.status}</span>
                  </div>
                  <p className="text-sm text-surface-300 text-center">
                    Successful students started <span className="text-white font-medium">{readiness.timeline.avgPrepWeeks} weeks</span> before.
                    Company visits in <span className="text-white font-medium">{readiness.timeline.companyVisitInWeeks} weeks</span>.
                  </p>
                </Reveal>

                {/* Quick Stats */}
                <Reveal delay={160} className="space-y-3 animate-slide-in-right" style={{ animationFillMode: 'both' }}>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-surface-800/30 group relative overflow-hidden">
                    <span className="text-xs text-surface-400">Similar Students</span>
                    <span className="text-sm font-bold text-white group-hover:scale-110 transition-transform">{readiness.similarStudentsCount}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-surface-800/30 group relative overflow-hidden">
                    <span className="text-xs text-surface-400">Strengths</span>
                    <span className="text-sm font-bold text-success-400 group-hover:scale-110 transition-transform">{readiness.yourStrengths.length}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-success-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-surface-800/30 group relative overflow-hidden">
                    <span className="text-xs text-surface-400">Focus Areas</span>
                    <span className="text-sm font-bold text-warning-400 group-hover:scale-110 transition-transform">{readiness.focusAreas.length}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-warning-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  </div>
                </Reveal>
              </div>
            </div>
          </Reveal>

          {/* Skill Radar + Focus Areas */}
          <Reveal delay={200} style={{ opacity: 0.1 + scrollProgress * 0.9, transform: 'translateY(' + 30 * (1 - scrollProgress) + 'px)' }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Reveal className="relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <SkillRadar data={skillRadarData} title="Skill Comparison" />
              </Reveal>

              <div className="space-y-4">
                {/* Strengths */}
                <Reveal delay={0} className="relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-success-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="glass rounded-2xl p-5 border border-white/5 relative z-10">
                    <h3 className="text-md font-semibold text-white mb-3 flex items-center gap-2 animate-slide-in-right">
                      <CheckCircle2 className="w-4 h-4 text-success-400 animate-bounce-gentle" />
                      Your Strengths
                    </h3>
                    <div className="space-y-2">
                      {readiness.yourStrengths.map((strength, i) => (
                        <Reveal key={strength.topic} delay={i * 60} className="flex items-center justify-between p-3 rounded-xl bg-success-500/5 border border-success-500/10 group relative overflow-hidden animate-slide-in-right" style={{ animationFillMode: 'both' }}>
                          <div>
                            <p className="text-sm font-medium text-surface-100">{strength.topic}</p>
                            <p className="text-xs text-surface-400">Target: {strength.targetScore}/10</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-success-400 animate-count-up">{strength.yourScore}/10</p>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-success-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        </Reveal>
                      ))}
                    </div>
                  </div>
                </Reveal>

                {/* Focus Areas */}
                <Reveal delay={100} className="relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-warning-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="glass rounded-2xl p-5 border border-white/5 relative z-10">
                    <h3 className="text-md font-semibold text-white mb-3 flex items-center gap-2 animate-slide-in-right">
                      <Target className="w-4 h-4 text-warning-400 animate-pulse-soft" />
                      Recommended Focus Areas
                    </h3>
                    <div className="space-y-3">
                      {readiness.focusAreas.map((area, i) => (
                        <Reveal key={area.topic} delay={i * 80} className="p-3 rounded-xl bg-warning-500/5 border border-warning-500/10 group relative overflow-hidden animate-slide-in-right" style={{ animationFillMode: 'both' }}>
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-surface-100">{area.topic}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-warning-400">{area.yourScore}/10</span>
                              <TrendingUp className="w-3 h-3 text-surface-500 animate-bounce-gentle" />
                              <span className="text-sm text-success-400">{area.targetScore}/10</span>
                            </div>
                          </div>
                          <div className="h-1.5 bg-surface-800 rounded-full overflow-hidden mb-2 group relative">
                            <div className="h-full bg-gradient-to-r from-warning-500 to-success-500 rounded-full animate-grow" style={{ width: '0%', transitionDelay: '300ms', animationDelay: i * 100 + 300 + 'ms' }} />
                          </div>
                          <p className="text-xs text-surface-400">{area.recommendation}</p>
                          <p className="text-xs text-primary-400 mt-1">{area.prevalence}</p>
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-warning-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        </Reveal>
                      ))}
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </Reveal>
        </>
      )}
    </div>
  );
}
