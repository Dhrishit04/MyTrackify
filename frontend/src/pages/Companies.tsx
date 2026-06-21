// ============================================
// Companies Page — Searchable company grid
// ============================================

import { useEffect, useState } from 'react';
import { Search, SlidersHorizontal, Building2, Grid3X3, List } from 'lucide-react';
import CompanyCard from '../components/company/CompanyCard';
import { companyService } from '../services/companyService';
import type { Company, CompanyFilters } from '../types';

const sectors = ['all', 'Product', 'Service', 'Trading', 'Consulting'];
const sortOptions = [
  { value: 'name', label: 'Name' },
  { value: 'successRate', label: 'Success Rate' },
  { value: 'totalApplications', label: 'Most Applied' },
];

export default function Companies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filters, setFilters] = useState<CompanyFilters>({
    search: '',
    sector: 'all',
    sortBy: 'name',
    sortOrder: 'asc',
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchCompanies = async () => {
      const data = await companyService.getCompanies(filters);
      if (!cancelled) {
        setCompanies(data);
        setIsLoadingCompanies(false);
      }
    };
    fetchCompanies();
    return () => { cancelled = true; };
  }, [filters]);

  const updateFilter = (key: keyof CompanyFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Building2 className="w-6 h-6 text-primary-400" />
          Company Library
        </h1>
        <p className="text-surface-400 mt-1">Browse company processes, success rates, and interview experiences</p>
      </div>

      {/* Filters Bar */}
      <div className="glass rounded-2xl p-4 border border-white/5">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              placeholder="Search companies..."
              className="input-dark w-full pl-10 pr-4 py-2.5 rounded-xl text-sm"
              id="companies-search"
            />
          </div>

          {/* Sector Filter */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-surface-400 hidden md:block" />
            <div className="flex gap-1.5 flex-wrap">
              {sectors.map((sector) => (
                <button
                  key={sector}
                  onClick={() => updateFilter('sector', sector)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filters.sector === sector
                      ? 'bg-primary-600/30 text-primary-300 border border-primary-500/30'
                      : 'bg-surface-800/50 text-surface-300 border border-white/5 hover:bg-surface-700/50'
                  }`}
                  id={`filter-sector-${sector}`}
                >
                  {sector === 'all' ? 'All Sectors' : sector}
                </button>
              ))}
            </div>
          </div>

          {/* Sort & View */}
          <div className="flex items-center gap-2">
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilter('sortBy', e.target.value)}
              className="input-dark px-3 py-2.5 rounded-xl text-xs appearance-none cursor-pointer"
              id="companies-sort"
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            <div className="flex bg-surface-800/50 rounded-lg p-0.5 border border-white/5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-primary-600/30 text-primary-300' : 'text-surface-400 hover:text-surface-200'}`}
                id="view-grid"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-primary-600/30 text-primary-300' : 'text-surface-400 hover:text-surface-200'}`}
                id="view-list"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-surface-400">{companies.length} companies found</p>

      {/* Company Grid */}
      {isLoadingCompanies ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 rounded-2xl shimmer" />
          ))}
        </div>
      ) : companies.length === 0 ? (
        <div className="text-center py-16">
          <Building2 className="w-12 h-12 text-surface-600 mx-auto mb-3" />
          <p className="text-surface-400">No companies match your search</p>
        </div>
      ) : (
        <div className={viewMode === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'
          : 'space-y-4'
        }>
          {companies.map((company, index) => (
            <CompanyCard key={company.id} company={company} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
