// ============================================
// SkillRadar — Radar chart for skill comparison
// ============================================

import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';

interface SkillDataPoint {
  subject: string;
  you: number;
  target: number;
  fullMark: number;
}

interface SkillRadarProps {
  data: SkillDataPoint[];
  title?: string;
}

export default function SkillRadar({ data, title }: SkillRadarProps) {
  return (
    <div className="glass rounded-2xl p-5 border border-white/5">
      {title && <h3 className="text-md font-semibold text-white mb-4">{title}</h3>}
      <div className="w-full min-h-[320px]">
        <ResponsiveContainer width="100%" height={320}>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="rgba(255,255,255,0.08)" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#b8b8d4', fontSize: 12 }}
          />
          <PolarRadiusAxis
            tick={{ fill: '#6b6b9e', fontSize: 10 }}
            axisLine={false}
            domain={[0, 10]}
          />
          <Radar
            name="Your Skills"
            dataKey="you"
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.25}
            strokeWidth={2}
          />
          <Radar
            name="Target (Successful Students)"
            dataKey="target"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.1}
            strokeWidth={2}
            strokeDasharray="4 4"
          />
          <Legend
            wrapperStyle={{ fontSize: '12px', color: '#9090b8' }}
          />
        </RadarChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
}
