import { useEffect, useRef, useState } from 'react';
import { Search, SlidersHorizontal, Building2, Grid3X3, List } from 'lucide-react';
import CompanyCard from '../components/company/CompanyCard';
import { companyService } from '../services/companyService';
import type { Company, CompanyFilters } from '../types';
import Reveal from '../components/landing/Reveal';
import { useLenis } from 'lenis/react';

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
  const lenis = useLenis();
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const updateFilter = (key: keyof CompanyFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div ref={containerRef} className="space-y-6 animate-fade-in relative" style={{ willChange: 'transform' }}>
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-500/3 via-transparent to-accent-500/3 animate-pulse-soft" />
        <div className="absolute top-20 right-20 w-80 h-80 bg-primary-500/5 rounded-full blur-[150px] animate-float" style={{ transform: 'translateY(' + scrollProgress * 30 + 'px)' }} />
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-accent-500/5 rounded-full blur-[120px] animate-float" style={{ animationDelay: '3s', transform: 'translateY(' + scrollProgress * -30 + 'px)' }} />
      </div>

      {/* Header */}
      <Reveal delay={0} className="relative z-10" style={{ opacity: 0.3 + scrollProgress * 0.7, transform: 'translateY(' + 30 * (1 - scrollProgress) + 'px)' }}>
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2 animate-slide-up">
            <Building2 className="w-6 h-6 text-primary-400 animate-float-slow" />
            Company Library
          </h1>
          <p className="text-surface-400 mt-1 animate-fade-in" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>Browse company processes, success rates, and interview experiences</p>
        </div>
      </Reveal>

      {/* Filters Bar */}
      <Reveal delay={100} style={{ opacity: 0.2 + scrollProgress * 0.8, transform: 'translateY(' + 20 * (1 - scrollProgress) + 'px)' }}>
        <div className="glass rounded-2xl p-4 border border-white/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex flex-col md:flex-row gap-4 relative z-10">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 group-focus-within:text-primary-400 transition-colors" />
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
                        ? 'bg-primary-600/30 text-primary-300 border border-primary-500/30 shadow-lg shadow-primary-500/10'
                        : 'bg-surface-800/50 text-surface-300 border border-white/5 hover:bg-surface-700/50 hover:border-white/10'
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
      </Reveal>

      {/* Results count */}
      <Reveal delay={200} className="relative z-10">
        <p className="text-sm text-surface-400 animate-fade-in" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>{companies.length} companies found</p>
      </Reveal>

      {/* Company Grid */}
      <Reveal delay={300} style={{ opacity: 0.1 + scrollProgress * 0.9, transform: 'translateY(' + 30 * (1 - scrollProgress) + 'px)' }}>
        {isLoadingCompanies ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <Reveal key={i} delay={i * 50} className="h-64 rounded-2xl shimmer">
                <div className="h-full w-full" />
              </Reveal>
            ))}
          </div>
        ) : companies.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <Building2 className="w-12 h-12 text-surface-600 mx-auto mb-3 animate-float-slow" />
            <p className="text-surface-400">No companies match your search</p>
          </div>
        ) : (
          <div className={viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'
            : 'space-y-4'
          }>
            {companies.map((company, index) => (
              <Reveal key={company.id} delay={index * 50} className="animate-slide-up" style={{ animationFillMode: 'both' }}>
                <CompanyCard company={company} index={index} />
              </Reveal>
            ))}
          </div>
        )}
      </Reveal>
    </div>
  );
}
