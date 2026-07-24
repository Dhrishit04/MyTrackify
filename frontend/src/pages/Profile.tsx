import { useEffect, useRef, useState } from 'react';
import { Code2, Trophy, Mail, GraduationCap, BookOpen, Calendar, Edit3 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import SkillRadar from '../components/analytics/SkillRadar';
import Badge from '../components/common/Badge';
import { userJourneys } from '../services/mockData';
import type { ApplicationJourney } from '../types';
import Reveal from '../components/landing/Reveal';
import { useLenis } from 'lenis/react';

export default function Profile() {
  const { user } = useAuth();
  const lenis = useLenis();
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

  const skillData = [
    { subject: 'DP', you: (user?.skillVector?.[0] || 0) * 10, target: 7, fullMark: 10 },
    { subject: 'Graphs', you: (user?.skillVector?.[1] || 0) * 10, target: 7.5, fullMark: 10 },
    { subject: 'Trees', you: (user?.skillVector?.[2] || 0) * 10, target: 6.5, fullMark: 10 },
    { subject: 'Arrays', you: (user?.skillVector?.[3] || 0) * 10, target: 7.5, fullMark: 10 },
    { subject: 'Strings', you: (user?.skillVector?.[4] || 0) * 10, target: 7, fullMark: 10 },
  ];

  const outcomeVariant = (outcome: string) => {
    switch (outcome) {
      case 'Selected': return 'selected';
      case 'Rejected': return 'rejected';
      case 'In Progress': return 'in-progress';
      case 'Withdrew': return 'withdrew';
      default: return 'sector';
    }
  };

  return (
    <div ref={containerRef} className="space-y-6 animate-fade-in max-w-5xl mx-auto relative" style={{ willChange: 'transform' }}>
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-500/3 via-transparent to-accent-500/3 animate-pulse-soft" />
        <div className="absolute top-20 right-20 w-80 h-80 bg-primary-500/5 rounded-full blur-[150px] animate-float" style={{ transform: 'translateY(' + scrollProgress * 30 + 'px)' }} />
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-accent-500/5 rounded-full blur-[120px] animate-float" style={{ animationDelay: '3s', transform: 'translateY(' + scrollProgress * -30 + 'px)' }} />
      </div>

      {/* Profile Header */}
      <Reveal delay={0} className="relative z-10" style={{ opacity: 0.3 + scrollProgress * 0.7, transform: 'translateY(' + 30 * (1 - scrollProgress) + 'px)' }}>
        <div className="glass rounded-2xl p-6 border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary-500/10 to-transparent rounded-bl-full animate-float-slow" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-2xl bg-primary-500 flex items-center justify-center text-white text-3xl font-bold shadow-xl animate-float">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-lg bg-surface-700 border border-white/10 flex items-center justify-center text-surface-300 hover:text-white hover:bg-surface-600 transition-colors opacity-0 group-hover:opacity-100 animate-slide-up" style={{ animationFillMode: 'both' }}>
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 text-center md:text-left animate-slide-up" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
              <h1 className="text-2xl font-bold text-white">{user?.anonymizedId || 'Student'}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-2 justify-center md:justify-start text-sm text-surface-400">
                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{user?.email}</span>
                <span className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5" />{user?.graduationYear}</span>
                <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" />{user?.branch}</span>
              </div>
            </div>

            <div className="flex gap-4 animate-fade-in" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
              <div className="text-center relative">
                <p className="text-2xl font-bold text-white">{user?.totalApplications || 0}</p>
                <p className="text-xs text-surface-400">Applications</p>
                <div className="absolute top-0 right-0 w-4 h-4 rounded-full bg-primary-500/20 blur-sm" />
              </div>
              <div className="text-center relative">
                <p className="text-2xl font-bold text-success-400">{user?.offersReceived || 0}</p>
                <p className="text-xs text-surface-400">Offers</p>
                <div className="absolute top-0 right-0 w-4 h-4 rounded-full bg-success-500/20 blur-sm" />
              </div>
              <div className="text-center relative">
                <p className="text-2xl font-bold text-accent-400">{user?.successRate || 0}%</p>
                <p className="text-xs text-surface-400">Success</p>
                <div className="absolute top-0 right-0 w-4 h-4 rounded-full bg-accent-500/20 blur-sm" />
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Skills & LeetCode */}
      <Reveal delay={150} style={{ opacity: 0.2 + scrollProgress * 0.8, transform: 'translateY(' + 20 * (1 - scrollProgress) + 'px)' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Skill Radar */}
          <Reveal className="relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <SkillRadar data={skillData} title="Skill Profile" />
          </Reveal>

          {/* LeetCode Stats */}
          <Reveal delay={100} className="relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-success-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="glass rounded-2xl p-5 border border-white/5 relative z-10">
              <h3 className="text-md font-semibold text-white mb-4 flex items-center gap-2 animate-slide-in-right">
                <Code2 className="w-5 h-5 text-primary-400" />
                Coding Profile
              </h3>
              <div className="space-y-4">
                <Reveal delay={0} className="flex items-center justify-between p-3 rounded-xl bg-surface-800/30 animate-slide-in-right" style={{ animationFillMode: 'both' }}>
                  <span className="text-sm text-surface-300">Total Problems</span>
                  <span className="text-lg font-bold text-white animate-count-up">{user?.leetcodeCount || 0}</span>
                </Reveal>
                <Reveal delay={80} className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-success-500/10 border border-success-500/20 text-center animate-scale-in" style={{ animationFillMode: 'both' }}>
                    <p className="text-lg font-bold text-success-400">{user?.leetcodeEasy || 0}</p>
                    <p className="text-xs text-surface-400">Easy</p>
                  </div>
                  <div className="p-3 rounded-xl bg-warning-500/10 border border-warning-500/20 text-center animate-scale-in" style={{ animationDelay: '50ms', animationFillMode: 'both' }}>
                    <p className="text-lg font-bold text-warning-400">{user?.leetcodeMedium || 0}</p>
                    <p className="text-xs text-surface-400">Medium</p>
                  </div>
                  <div className="p-3 rounded-xl bg-danger-500/10 border border-danger-500/20 text-center animate-scale-in" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
                    <p className="text-lg font-bold text-danger-400">{user?.leetcodeHard || 0}</p>
                    <p className="text-xs text-surface-400">Hard</p>
                  </div>
                </Reveal>
                {user?.contestRating && (
                  <Reveal delay={160} className="flex items-center justify-between p-3 rounded-xl bg-surface-800/30 animate-slide-in-right" style={{ animationFillMode: 'both' }}>
                    <span className="text-sm text-surface-300 flex items-center gap-1.5">
                      <Trophy className="w-4 h-4 text-warning-400" />
                      Contest Rating
                    </span>
                    <span className="text-lg font-bold text-gradient animate-count-up">{user.contestRating}</span>
                  </Reveal>
                )}
                <Reveal delay={240} className="animate-fade-in" style={{ animationFillMode: 'both' }}>
                  <p className="text-xs text-surface-400 mb-1.5">CGPA Range</p>
                  <p className="text-sm font-medium text-surface-100">{user?.cgpaRange || 'Not set'}</p>
                </Reveal>
              </div>
            </div>
          </Reveal>
        </div>
      </Reveal>

      {/* Application History */}
      <Reveal delay={300} style={{ opacity: 0.1 + scrollProgress * 0.9, transform: 'translateY(' + 30 * (1 - scrollProgress) + 'px)' }}>
        <div className="glass rounded-2xl p-5 border border-white/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h3 className="text-md font-semibold text-white flex items-center gap-2 animate-slide-in-right">
              <Calendar className="w-5 h-5 text-primary-400 animate-float" />
              Application History
            </h3>
          </div>
          <div className="overflow-x-auto relative z-10">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-xs font-medium text-surface-400 pb-3 pr-4">Company</th>
                  <th className="text-left text-xs font-medium text-surface-400 pb-3 pr-4">Type</th>
                  <th className="text-left text-xs font-medium text-surface-400 pb-3 pr-4">Date</th>
                  <th className="text-left text-xs font-medium text-surface-400 pb-3 pr-4">Round Reached</th>
                  <th className="text-left text-xs font-medium text-surface-400 pb-3 pr-4">CTC</th>
                  <th className="text-left text-xs font-medium text-surface-400 pb-3">Outcome</th>
                </tr>
              </thead>
              <tbody>
                {userJourneys.map((j: ApplicationJourney, i) => (
                  <Reveal key={j.id} delay={i * 50} className="animate-slide-in-right" style={{ animationFillMode: 'both' }}>
                    <tr className="border-b border-white/[0.03] hover:bg-surface-800/20 transition-colors group">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-md bg-surface-700 flex items-center justify-center text-xs font-semibold text-primary-300 group-hover:scale-110 transition-transform">
                            {j.companyName?.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-surface-100">{j.companyName}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-xs text-surface-300">{j.applicationType}</td>
                      <td className="py-3 pr-4 text-xs text-surface-300">{j.applicationDate}</td>
                      <td className="py-3 pr-4 text-xs text-surface-300">{j.finalRoundReached || '—'}</td>
                      <td className="py-3 pr-4 text-sm font-medium text-surface-100">
                        {j.compensationOffered ? `${j.compensationOffered} LPA` : '—'}
                      </td>
                      <td className="py-3">
                        <Badge variant={outcomeVariant(j.finalOutcome) as 'selected' | 'rejected' | 'in-progress' | 'withdrew' | 'sector'}>{j.finalOutcome}</Badge>
                      </td>
                    </tr>
                  </Reveal>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
