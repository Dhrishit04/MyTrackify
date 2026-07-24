import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FileText, Trophy, Target, Building2, PenSquare, Clock, ArrowRight, Sparkles } from 'lucide-react';
import StatCard from '../components/common/StatCard';
import Badge from '../components/common/Badge';
import { analyticsService } from '../services/analyticsService';
import { useAuth } from '../hooks/useAuth';
import type { DashboardStats, ApplicationJourney } from '../types';
import { userJourneys } from '../services/mockData';
import Reveal from '../components/landing/Reveal';
import { useLenis } from 'lenis/react';

interface TooltipPayload {
  payload: { name: string; value: number };
  value: number;
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: TooltipPayload[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-strong rounded-lg p-3 border border-white/10 shadow-xl">
        <p className="text-xs text-surface-400 mb-1">{label}</p>
        <p className="text-sm font-semibold text-white">{payload[0].value} applications</p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const lenis = useLenis();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    analyticsService.getDashboardStats()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

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

  const outcomeVariant = (outcome: string) => {
    switch (outcome) {
      case 'Selected': return 'selected';
      case 'Rejected': return 'rejected';
      case 'In Progress': return 'in-progress';
      case 'Withdrew': return 'withdrew';
      default: return 'sector';
    }
  };

  if (loading || !stats) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="h-32 rounded-2xl shimmer">
                <div className="h-full w-full" />
              </div>
            </Reveal>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Reveal delay={200}>
            <div className="h-80 rounded-2xl shimmer">
              <div className="h-full w-full" />
            </div>
          </Reveal>
          <Reveal delay={300}>
            <div className="h-80 rounded-2xl shimmer">
              <div className="h-full w-full" />
            </div>
          </Reveal>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="space-y-6 animate-fade-in relative" style={{ willChange: 'transform' }}>
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-500/3 via-transparent to-accent-500/3 animate-pulse-soft" />
        <div className="absolute top-20 right-20 w-80 h-80 bg-primary-500/5 rounded-full blur-[150px] animate-float" style={{ transform: 'translateY(' + scrollProgress * 30 + 'px)' }} />
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-accent-500/5 rounded-full blur-[120px] animate-float" style={{ animationDelay: '3s', transform: 'translateY(' + scrollProgress * -30 + 'px)' }} />
      </div>

      {/* Welcome Header */}
      <Reveal delay={0} className="relative z-10" style={{ opacity: 0.3 + scrollProgress * 0.7, transform: 'translateY(' + 30 * (1 - scrollProgress) + 'px)' }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2 animate-slide-up">
              Welcome back
              <span className="text-gradient">{user?.anonymizedId || 'Student'}</span>
              <Sparkles className="w-5 h-5 text-primary-400 animate-float" />
            </h1>
            <p className="text-surface-400 mt-1 animate-fade-in" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>Here's your placement journey at a glance</p>
          </div>
          <button
            onClick={() => navigate('/log-experience')}
            className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium transition-all shadow-lg hover:shadow-primary-500/25 group relative overflow-hidden"
            id="dashboard-log-btn"
          >
            <span className="relative z-10"><PenSquare className="w-4 h-4" /> Log Experience</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </button>
        </div>
      </Reveal>

      {/* Stat Cards with stagger */}
      <Reveal delay={100} style={{ opacity: 0.2 + scrollProgress * 0.8, transform: 'translateY(' + 20 * (1 - scrollProgress) + 'px)' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Reveal delay={0} className="animate-slide-up" style={{ animationFillMode: 'both' }}>
            <StatCard
              title="Applications"
              value={stats.totalApplications}
              icon={<FileText className="w-5 h-5" />}
              trend={{ value: 12, label: 'this month' }}
              color="primary"
              delay={0}
            />
          </Reveal>
          <Reveal delay={80} className="animate-slide-up" style={{ animationFillMode: 'both' }}>
            <StatCard
              title="Offers"
              value={stats.totalOffers}
              icon={<Trophy className="w-5 h-5" />}
              color="success"
              delay={100}
            />
          </Reveal>
          <Reveal delay={160} className="animate-slide-up" style={{ animationFillMode: 'both' }}>
            <StatCard
              title="Success Rate"
              value={stats.successRate}
              suffix="%"
              icon={<Target className="w-5 h-5" />}
              trend={{ value: 5, label: 'vs avg' }}
              color="accent"
              delay={200}
            />
          </Reveal>
          <Reveal delay={240} className="animate-slide-up" style={{ animationFillMode: 'both' }}>
            <StatCard
              title="Companies"
              value={stats.companiesExplored}
              icon={<Building2 className="w-5 h-5" />}
              color="warning"
              delay={300}
            />
          </Reveal>
          <Reveal delay={320} className="animate-slide-up" style={{ animationFillMode: 'both' }}>
            <StatCard
              title="Experiences Logged"
              value={stats.experiencesLogged}
              icon={<PenSquare className="w-5 h-5" />}
              color="primary"
              delay={400}
            />
          </Reveal>
        </div>
      </Reveal>

      {/* Charts Row */}
      <Reveal delay={200} style={{ opacity: 0.1 + scrollProgress * 0.9, transform: 'translateY(' + 30 * (1 - scrollProgress) + 'px)' }}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Applications Over Time */}
          <div className="lg:col-span-2 glass rounded-2xl p-5 border border-white/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <h3 className="text-md font-semibold text-white mb-4 relative z-10 animate-slide-in-right" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>Applications Over Time</h3>
            <div className="w-full min-h-[260px] relative z-10">
              <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stats.applicationsByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: '#9090b8', fontSize: 12 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
                <YAxis tick={{ fill: '#9090b8', fontSize: 12 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }} />
                <Bar dataKey="value" fill="url(#barGradient)" radius={[6, 6, 0, 0]} maxBarSize={40}>
                  {stats.applicationsByMonth.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(${245 + index * 10}, 80%, ${55 + index * 3}%)`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            </div>
          </div>

          {/* Outcome Distribution */}
          <div className="glass rounded-2xl p-5 border border-white/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-success-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <h3 className="text-md font-semibold text-white mb-4 relative z-10 animate-slide-in-right" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>Outcome Distribution</h3>
            <div className="w-full min-h-[200px] relative z-10">
              <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={stats.outcomeDistribution}
                  cx="50%" cy="50%"
                  innerRadius={55} outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {stats.outcomeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: 'rgba(12,12,29,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
              </PieChart>
            </ResponsiveContainer>
            </div>
            {stats.outcomeDistribution.length > 0 && (
            <div className="flex flex-wrap gap-3 justify-center mt-4 relative z-10">
              {stats.outcomeDistribution.map((item, i) => (
                <Reveal key={item.name} delay={i * 80} className="flex items-center gap-1.5 text-xs animate-slide-up" style={{ animationFillMode: 'both' }}>
                  <div className="w-2.5 h-2.5 rounded-full animate-pulse-soft" style={{ background: item.color }} />
                  <span className="text-surface-300">{item.name} ({item.value})</span>
                </Reveal>
              ))}
            </div>
            )}
          </div>
        </div>
      </Reveal>

      {/* Bottom Row */}
      <Reveal delay={300} style={{ opacity: 0.1 + scrollProgress * 0.9, transform: 'translateY(' + 30 * (1 - scrollProgress) + 'px)' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="glass rounded-2xl p-5 border border-white/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between mb-4 relative z-10">
              <h3 className="text-md font-semibold text-white animate-slide-in-right" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>Recent Activity</h3>
              <Clock className="w-4 h-4 text-surface-400 animate-float" />
            </div>
            <div className="space-y-3 relative z-10">
              {stats.recentActivity.map((activity, i) => (
                <Reveal key={activity.id} delay={i * 80} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-800/30 transition-colors animate-slide-in-right" style={{ animationFillMode: 'both' }}>
                  <span className="text-xl animate-float-slow" style={{ animationDelay: i * 200 + 'ms' }}>{activity.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-surface-100 truncate">{activity.title}</p>
                    <p className="text-xs text-surface-400 truncate">{activity.subtitle}</p>
                  </div>
                  <span className="text-xs text-surface-500 whitespace-nowrap">
                    {new Date(activity.timestamp).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                  </span>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Your Applications */}
          <div className="glass rounded-2xl p-5 border border-white/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-accent-500/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between mb-4 relative z-10">
              <h3 className="text-md font-semibold text-white animate-slide-in-right" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>Your Applications</h3>
              <button onClick={() => navigate('/companies')} className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1 transition-colors group">
                View All <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="space-y-2 relative z-10">
              {userJourneys.slice(0, 5).map((journey: ApplicationJourney, i: number) => (
                <Reveal key={journey.id} delay={i * 80} className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-800/30 transition-colors animate-slide-in-right" style={{ animationFillMode: 'both' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface-700 flex items-center justify-center text-xs font-bold text-primary-300 group-hover:scale-110 transition-transform">
                      {journey.companyName?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-surface-100">{journey.companyName}</p>
                      <p className="text-xs text-surface-400">{journey.applicationType} · {journey.applicationDate}</p>
                    </div>
                  </div>
                  <Badge variant={outcomeVariant(journey.finalOutcome) as 'selected' | 'rejected' | 'in-progress' | 'withdrew' | 'sector'}>
                    {journey.finalOutcome}
                  </Badge>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}