// ============================================
// SuccessRateChart — Bar chart for round stats
// ============================================

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { RoundStats } from '../../types';

interface SuccessRateChartProps {
  data: RoundStats[];
  title?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="glass-strong rounded-lg p-3 border border-white/10 shadow-xl">
        <p className="text-sm font-semibold text-white mb-1">{label}</p>
        <p className="text-xs text-surface-300">Total Attempts: {data.totalAttempts}</p>
        <p className="text-xs text-success-400">Passed: {data.passedCount}</p>
        <p className="text-xs text-danger-400">Failed: {data.failedCount}</p>
        <p className="text-xs text-warning-400 mt-1 font-medium">Elimination Rate: {data.eliminationRate}%</p>
      </div>
    );
  }
  return null;
};

export default function SuccessRateChart({ data, title }: SuccessRateChartProps) {
  const chartData = data.map(d => ({
    ...d,
    name: `R${d.roundNumber}: ${d.roundType}`,
    shortName: `Round ${d.roundNumber}`,
  }));

  const getBarColor = (eliminationRate: number) => {
    if (eliminationRate >= 60) return '#f43f5e';
    if (eliminationRate >= 40) return '#f59e0b';
    return '#10b981';
  };

  return (
    <div className="glass rounded-2xl p-5 border border-white/5">
      {title && <h3 className="text-md font-semibold text-white mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="shortName"
            tick={{ fill: '#9090b8', fontSize: 12 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
          />
          <YAxis
            tick={{ fill: '#9090b8', fontSize: 12 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            domain={[0, 100]}
            unit="%"
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }} />
          <Bar dataKey="eliminationRate" radius={[8, 8, 0, 0]} maxBarSize={60}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.eliminationRate)} fillOpacity={0.8} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
