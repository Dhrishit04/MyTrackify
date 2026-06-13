// ============================================
// Profile Page
// ============================================

import { Code2, Trophy, Mail, GraduationCap, BookOpen, Calendar, Edit3 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import SkillRadar from '../components/analytics/SkillRadar';
import Badge from '../components/common/Badge';
import { userJourneys } from '../services/mockData';
import type { ApplicationJourney } from '../types';

export default function Profile() {
  const { user } = useAuth();

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
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Profile Header */}
      <div className="glass rounded-2xl p-6 border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary-500/10 to-transparent rounded-bl-full" />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-3xl font-bold shadow-xl">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-lg bg-surface-700 border border-white/10 flex items-center justify-center text-surface-300 hover:text-white hover:bg-surface-600 transition-colors opacity-0 group-hover:opacity-100">
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold text-white">{user?.anonymizedId || 'Student'}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 justify-center md:justify-start text-sm text-surface-400">
              <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{user?.email}</span>
              <span className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5" />{user?.graduationYear}</span>
              <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" />{user?.branch}</span>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{user?.totalApplications || 0}</p>
              <p className="text-xs text-surface-400">Applications</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-success-400">{user?.offersReceived || 0}</p>
              <p className="text-xs text-surface-400">Offers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-accent-400">{user?.successRate || 0}%</p>
              <p className="text-xs text-surface-400">Success</p>
            </div>
          </div>
        </div>
      </div>

      {/* Skills & LeetCode */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skill Radar */}
        <SkillRadar data={skillData} title="Skill Profile" />

        {/* LeetCode Stats */}
        <div className="glass rounded-2xl p-5 border border-white/5">
          <h3 className="text-md font-semibold text-white mb-4 flex items-center gap-2">
            <Code2 className="w-5 h-5 text-primary-400" />
            Coding Profile
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-800/30">
              <span className="text-sm text-surface-300">Total Problems</span>
              <span className="text-lg font-bold text-white">{user?.leetcodeCount || 0}</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-success-500/10 border border-success-500/20 text-center">
                <p className="text-lg font-bold text-success-400">{user?.leetcodeEasy || 0}</p>
                <p className="text-xs text-surface-400">Easy</p>
              </div>
              <div className="p-3 rounded-xl bg-warning-500/10 border border-warning-500/20 text-center">
                <p className="text-lg font-bold text-warning-400">{user?.leetcodeMedium || 0}</p>
                <p className="text-xs text-surface-400">Medium</p>
              </div>
              <div className="p-3 rounded-xl bg-danger-500/10 border border-danger-500/20 text-center">
                <p className="text-lg font-bold text-danger-400">{user?.leetcodeHard || 0}</p>
                <p className="text-xs text-surface-400">Hard</p>
              </div>
            </div>
            {user?.contestRating && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-800/30">
                <span className="text-sm text-surface-300 flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-warning-400" />
                  Contest Rating
                </span>
                <span className="text-lg font-bold text-gradient">{user.contestRating}</span>
              </div>
            )}
            <div>
              <p className="text-xs text-surface-400 mb-1.5">CGPA Range</p>
              <p className="text-sm font-medium text-surface-100">{user?.cgpaRange || 'Not set'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Application History */}
      <div className="glass rounded-2xl p-5 border border-white/5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-md font-semibold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary-400" />
            Application History
          </h3>
        </div>
        <div className="overflow-x-auto">
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
              {userJourneys.map((j: ApplicationJourney) => (
                <tr key={j.id} className="border-b border-white/[0.03] hover:bg-surface-800/20 transition-colors">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-md bg-surface-700 flex items-center justify-center text-xs font-semibold text-primary-300">
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
                    <Badge variant={outcomeVariant(j.finalOutcome) as any}>{j.finalOutcome}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
