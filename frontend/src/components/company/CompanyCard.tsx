import { useNavigate } from 'react-router-dom';
import { Building2, Users, Trophy, TrendingUp, ArrowRight } from 'lucide-react';
import Badge from '../common/Badge';
import type { Company } from '../../types';

interface CompanyCardProps {
  company: Company;
  index: number;
}

export default function CompanyCard({ company, index }: CompanyCardProps) {
  const navigate = useNavigate();

  const sectorColors: Record<string, string> = {
    Product: 'from-primary-500 to-violet-600',
    Service: 'from-emerald-500 to-teal-600',
    Trading: 'from-amber-500 to-orange-600',
    Consulting: 'from-cyan-500 to-blue-600',
  };

  const gradientClass = sectorColors[company.sector] || sectorColors.Product;

  return (
    <div
      onClick={() => navigate(`/companies/${company.id}`)}
      className="group relative overflow-hidden rounded-2xl bg-gradient-card border border-white/5 p-6 cursor-pointer card-hover animate-slide-up min-h-[280px] flex flex-col"
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'both' }}
      id={`company-card-${company.id}`}
    >
      {/* Background gradient accent */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${gradientClass} opacity-5 rounded-bl-full group-hover:opacity-10 transition-opacity`} />

      {/* Header */}
      <div className="flex items-start justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center shadow-lg flex-shrink-0`}>
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-white group-hover:text-primary-300 transition-colors truncate">
              {company.name}
            </h3>
            <p className="text-xs text-surface-400 truncate">{company.headquartersLocation}</p>
          </div>
        </div>
        <Badge variant="sector">{company.sector}</Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-surface-400 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs text-surface-400">Applications</p>
            <p className="text-sm font-semibold text-surface-100 truncate">{company.totalApplications}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-surface-400 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs text-surface-400">Offers</p>
            <p className="text-sm font-semibold text-surface-100 truncate">{company.totalOffers}</p>
          </div>
        </div>
      </div>

      {/* Success Rate Bar */}
      <div className="mb-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-surface-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 flex-shrink-0" />
            Success Rate
          </span>
          <span className="text-sm font-bold text-white flex-shrink-0">{company.avgSuccessRate}%</span>
        </div>
        <div className="h-2 bg-surface-800 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${gradientClass} rounded-full transition-all duration-1000 ease-out`}
            style={{ width: `${Math.min(company.avgSuccessRate, 100)}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-white/5 flex-shrink-0 mt-auto">
        <div className="flex flex-wrap gap-1.5 min-w-0 flex-1">
          {company.typicalRoles.slice(0, 2).map((role) => (
            <span key={role} className="text-xs px-2 py-0.5 bg-surface-800/80 rounded-md text-surface-300 whitespace-nowrap">
              {role}
            </span>
          ))}
        </div>
        <span className="text-xs font-medium text-primary-400 flex items-center gap-1 group-hover:gap-2 transition-all flex-shrink-0">
          View Details <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
}
