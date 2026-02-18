'use client';

import { ProgressEntry } from '@/types/progress';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface MeasurementsRadarProps {
  entries: ProgressEntry[];
}

const MEASUREMENT_KEYS = ['chest', 'waist', 'hips', 'biceps', 'thighs'] as const;

export function MeasurementsRadar({ entries }: MeasurementsRadarProps) {
  const entriesWithMeasurements = entries.filter(
    (e) => e.measurements && MEASUREMENT_KEYS.some((k) => e.measurements?.[k])
  );

  if (entriesWithMeasurements.length === 0) {
    return (
      <div className="bg-card border border-card-border rounded-2xl p-4">
        <p className="text-sm font-medium mb-3">Body Measurements</p>
        <p className="text-xs text-muted text-center py-8">No measurement data yet</p>
      </div>
    );
  }

  const latest = entriesWithMeasurements[0];
  const previous = entriesWithMeasurements.length > 1 ? entriesWithMeasurements[1] : null;

  const data = MEASUREMENT_KEYS.map((key) => ({
    measurement: key.charAt(0).toUpperCase() + key.slice(1),
    current: latest.measurements?.[key] ?? 0,
    previous: previous?.measurements?.[key] ?? 0,
  }));

  const hasCurrentData = data.some((d) => d.current > 0);
  if (!hasCurrentData) {
    return (
      <div className="bg-card border border-card-border rounded-2xl p-4">
        <p className="text-sm font-medium mb-3">Body Measurements</p>
        <p className="text-xs text-muted text-center py-8">No measurement data yet</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-card-border rounded-2xl p-4">
      <p className="text-sm font-medium mb-3">Body Measurements</p>
      <ResponsiveContainer width="100%" height={240}>
        <RadarChart data={data}>
          <PolarGrid stroke="#27272a" />
          <PolarAngleAxis dataKey="measurement" tick={{ fontSize: 10, fill: '#a1a1aa' }} />
          <PolarRadiusAxis tick={{ fontSize: 8, fill: '#71717a' }} />
          <Radar
            name="Current"
            dataKey="current"
            stroke="#84cc16"
            fill="#84cc16"
            fillOpacity={0.2}
            strokeWidth={2}
          />
          {previous && (
            <Radar
              name="Previous"
              dataKey="previous"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.1}
              strokeWidth={1.5}
              strokeDasharray="4 4"
            />
          )}
          <Legend
            wrapperStyle={{ fontSize: '11px', color: '#a1a1aa' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
