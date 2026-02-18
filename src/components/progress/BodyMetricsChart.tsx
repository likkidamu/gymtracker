'use client';

import { ProgressEntry } from '@/types/progress';
import { formatShortDate } from '@/lib/utils/dates';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface BodyMetricsChartProps {
  entries: ProgressEntry[];
}

export function BodyMetricsChart({ entries }: BodyMetricsChartProps) {
  const data = [...entries]
    .filter((e) => e.weight)
    .reverse()
    .map((e) => ({
      date: formatShortDate(e.date),
      weight: e.weight,
      bodyFat: e.bodyFatPercentage,
    }));

  if (data.length < 2) return null;

  return (
    <div className="bg-card border border-card-border rounded-2xl p-4">
      <p className="text-sm font-medium mb-3">Weight Trend</p>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#84cc16" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#84cc16" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="bodyFatGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#a1a1aa' }} />
          <YAxis tick={{ fontSize: 10, fill: '#a1a1aa' }} domain={['auto', 'auto']} />
          <Tooltip
            contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '12px', fontSize: '12px', color: '#fafafa' }}
            labelStyle={{ color: '#fafafa' }}
            itemStyle={{ color: '#fafafa' }}
          />
          <Area type="monotone" dataKey="weight" stroke="#84cc16" strokeWidth={2} fill="url(#weightGradient)" dot={{ fill: '#84cc16', r: 3 }} name="Weight (kg)" />
          {data.some((d) => d.bodyFat) && (
            <Area type="monotone" dataKey="bodyFat" stroke="#3b82f6" strokeWidth={2} fill="url(#bodyFatGradient)" dot={{ fill: '#3b82f6', r: 3 }} name="Body Fat (%)" />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
