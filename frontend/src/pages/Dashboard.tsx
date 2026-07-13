import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FileText, Trophy, Target, Building2, PenSquare, Clock, ArrowRight, Sparkles } from 'lucide-react';
import StatCard from '../components/common/StatCard';
import Badge from '../components/common/Badge';
import { analyticsService } from '../services/analyticsService';
import { useAuth } from '../hooks/useAuth';
import type { DashboardStats, ApplicationJourney } from '../types';
import { userJourneys } from '../services/mockData';

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
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsService.getDashboardStats()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 rounded-2xl shimmer" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 rounded-2xl shimmer" />
          <div className="h-80 rounded-2xl shimmer" />
        </div>
      </div>
    );
  }

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
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Welcome back
            <span className="text-gradient">{user?.anonymizedId || 'Student'}</span>
            <Sparkles className="w-5 h-5 text-primary-400" />
          </h1>
          <p className="text-surface-400 mt-1">Here's your placement journey at a glance</p>
        </div>
        <button
          onClick={() => navigate('/log-experience')}
          className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium transition-all shadow-lg hover:shadow-primary-500/25"
          id="dashboard-log-btn"
        >
          <PenSquare className="w-4 h-4" />
          Log Experience
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Applications"
          value={stats.totalApplications}
          icon={<FileText className="w-5 h-5" />}
          trend={{ value: 12, label: 'this month' }}
          color="primary"
          delay={0}
        />
        <StatCard
          title="Offers"
          value={stats.totalOffers}
          icon={<Trophy className="w-5 h-5" />}
          color="success"
          delay={100}
        />
        <StatCard
          title="Success Rate"
          value={stats.successRate}
          suffix="%"
          icon={<Target className="w-5 h-5" />}
          trend={{ value: 5, label: 'vs avg' }}
          color="accent"
          delay={200}
        />
        <StatCard
          title="Companies"
          value={stats.companiesExplored}
          icon={<Building2 className="w-5 h-5" />}
          color="warning"
          delay={300}
        />
        <StatCard
          title="Experiences Logged"
          value={stats.experiencesLogged}
          icon={<PenSquare className="w-5 h-5" />}
          color="primary"
          delay={400}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Applications Over Time */}
        <div className="lg:col-span-2 glass rounded-2xl p-5 border border-white/5">
          <h3 className="text-md font-semibold text-white mb-4">Applications Over Time</h3>
          <div className="w-full min-h-[260px]">
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
        <div className="glass rounded-2xl p-5 border border-white/5">
          <h3 className="text-md font-semibold text-white mb-4">Outcome Distribution</h3>
          <div className="w-full min-h-[200px]">
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
          <div className="flex flex-wrap gap-3 justify-center">
            {stats.outcomeDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                <span className="text-surface-300">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="glass rounded-2xl p-5 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-md font-semibold text-white">Recent Activity</h3>
            <Clock className="w-4 h-4 text-surface-400" />
          </div>
          <div className="space-y-3">
            {stats.recentActivity.map((activity, i) => (
              <div key={activity.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-800/30 transition-colors animate-slide-in-right" style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both' }}>
                <span className="text-xl">{activity.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-surface-100 truncate">{activity.title}</p>
                  <p className="text-xs text-surface-400 truncate">{activity.subtitle}</p>
                </div>
                <span className="text-xs text-surface-500 whitespace-nowrap">
                  {new Date(activity.timestamp).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Your Applications */}
        <div className="glass rounded-2xl p-5 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-md font-semibold text-white">Your Applications</h3>
            <button onClick={() => navigate('/companies')} className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1 transition-colors">
              View All <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2">
            {userJourneys.slice(0, 5).map((journey: ApplicationJourney, i: number) => (
              <div key={journey.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-800/30 transition-colors animate-slide-in-right" style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both' }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface-700 flex items-center justify-center text-xs font-semibold text-primary-300">
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
