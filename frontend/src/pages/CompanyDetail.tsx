import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Globe, MapPin, Calendar, Users, Trophy, TrendingUp, Bookmark } from 'lucide-react';
import ProcessTimeline from '../components/company/ProcessTimeline';
import ExperienceCard from '../components/company/ExperienceCard';
import SuccessRateChart from '../components/analytics/SuccessRateChart';
import Badge from '../components/common/Badge';
import { companyService } from '../services/companyService';
import type { CompanyWithProcess, RoundStats } from '../types';

export default function CompanyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [company, setCompany] = useState<CompanyWithProcess | null>(null);
  const [roundStats, setRoundStats] = useState<RoundStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!id) return;
    const companyId = parseInt(id);
    Promise.all([
      companyService.getCompanyById(companyId),
      companyService.getRoundStats(companyId),
    ])
      .then(([comp, stats]) => {
        setCompany(comp);
        setRoundStats(stats);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-48 rounded-2xl shimmer" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-96 rounded-2xl shimmer" />
          <div className="h-96 rounded-2xl shimmer" />
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="text-center py-20">
        <p className="text-surface-400 text-lg">Company not found</p>
        <button onClick={() => navigate('/companies')} className="mt-4 text-primary-400 hover:text-primary-300 text-sm">
          ← Back to Companies
        </button>
      </div>
    );
  }

  const sectorColors: Record<string, string> = {
    Product: 'from-primary-500 to-violet-600',
    Service: 'from-emerald-500 to-teal-600',
    Trading: 'from-amber-500 to-orange-600',
    Consulting: 'from-cyan-500 to-blue-600',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back button */}
      <button
        onClick={() => navigate('/companies')}
        className="flex items-center gap-2 text-sm text-surface-400 hover:text-surface-200 transition-colors"
        id="back-to-companies"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Companies
      </button>

      {/* Company Header */}
      <div className="glass rounded-2xl p-6 border border-white/5 relative overflow-hidden">
        {/* Background accent */}
        <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl ${sectorColors[company.sector] || sectorColors.Product} opacity-5 rounded-bl-full`} />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${sectorColors[company.sector] || sectorColors.Product} flex items-center justify-center shadow-xl text-white text-2xl font-bold`}>
              {company.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white">{company.name}</h1>
                <Badge variant="sector" size="md">{company.sector}</Badge>
              </div>
              <div className="flex items-center gap-4 mt-1 text-sm text-surface-400">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{company.headquartersLocation}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{company.visitFrequency}</span>
                <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary-400 hover:text-primary-300">
                  <Globe className="w-3.5 h-3.5" />Website
                </a>
              </div>
            </div>
          </div>

          <button
            onClick={() => setSaved(!saved)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
              saved
                ? 'bg-primary-600/20 border-primary-500/30 text-primary-300'
                : 'border-white/10 text-surface-300 hover:bg-surface-800'
            }`}
            id="save-company"
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
            {saved ? 'Saved' : 'Save'}
          </button>
        </div>

        {/* Quick Stats */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/5">
          <div>
            <p className="text-xs text-surface-400 flex items-center gap-1"><Users className="w-3 h-3" />Applications</p>
            <p className="text-xl font-bold text-white mt-0.5">{company.totalApplications}</p>
          </div>
          <div>
            <p className="text-xs text-surface-400 flex items-center gap-1"><Trophy className="w-3 h-3" />Offers</p>
            <p className="text-xl font-bold text-white mt-0.5">{company.totalOffers}</p>
          </div>
          <div>
            <p className="text-xs text-surface-400 flex items-center gap-1"><TrendingUp className="w-3 h-3" />Success Rate</p>
            <p className="text-xl font-bold text-white mt-0.5">{company.avgSuccessRate}%</p>
          </div>
          <div>
            <p className="text-xs text-surface-400">Avg CTC</p>
            <p className="text-xl font-bold text-gradient mt-0.5">{company.avgCtcRange}</p>
          </div>
        </div>

        {/* Roles */}
        <div className="relative z-10 flex flex-wrap gap-2 mt-4">
          {company.typicalRoles.map((role) => (
            <span key={role} className="text-xs px-3 py-1 bg-surface-800/60 rounded-lg text-surface-300 border border-white/5">
              {role}
            </span>
          ))}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left — Process Timeline */}
        <div>
          {company.currentProcess ? (
            <ProcessTimeline
              rounds={company.currentProcess.rounds}
              verifiedCount={company.currentProcess.verifiedCount}
            />
          ) : (
            <div className="glass rounded-2xl p-8 border border-white/5 text-center">
              <p className="text-surface-400">No process data available yet</p>
            </div>
          )}
        </div>

        {/* Right — Round Stats Chart */}
        <div>
          {roundStats.length > 0 ? (
            <SuccessRateChart data={roundStats} title="Round-by-Round Elimination Rates" />
          ) : (
            <div className="glass rounded-2xl p-8 border border-white/5 text-center">
              <p className="text-surface-400">Not enough data for statistics yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Experiences Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">
            Recent Experiences ({company.recentExperiences.length} logged)
          </h2>
        </div>

        {company.recentExperiences.length > 0 ? (
          <div className="space-y-4">
            {company.recentExperiences.map((exp, i) => (
              <ExperienceCard key={exp.id} experience={exp} index={i} />
            ))}
          </div>
        ) : (
          <div className="glass rounded-2xl p-8 border border-white/5 text-center">
            <p className="text-surface-400">No experiences logged yet. Be the first!</p>
          </div>
        )}
      </div>
    </div>
  );
}
