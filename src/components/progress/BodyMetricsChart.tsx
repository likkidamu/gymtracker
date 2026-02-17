'use client';

import { ProgressEntry } from '@/types/progress';
import { formatShortDate } from '@/lib/utils/dates';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#a1a1aa' }} />
          <YAxis tick={{ fontSize: 10, fill: '#a1a1aa' }} domain={['auto', 'auto']} />
          <Tooltip
            contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px', fontSize: '12px' }}
            labelStyle={{ color: '#fafafa' }}
          />
          <Line type="monotone" dataKey="weight" stroke="#84cc16" strokeWidth={2} dot={{ fill: '#84cc16', r: 3 }} name="Weight (kg)" />
          {data.some((d) => d.bodyFat) && (
            <Line type="monotone" dataKey="bodyFat" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 3 }} name="Body Fat (%)" />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
