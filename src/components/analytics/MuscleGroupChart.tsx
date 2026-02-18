'use client';

import { TrainingPlan } from '@/types/training';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface MuscleGroupChartProps {
  plan: TrainingPlan | null;
}

const COLORS = ['#84cc16', '#3b82f6', '#f59e0b', '#ef4444', '#a78bfa', '#ec4899', '#14b8a6', '#f97316'];

export function MuscleGroupChart({ plan }: MuscleGroupChartProps) {
  if (!plan) {
    return (
      <div className="bg-card border border-card-border rounded-2xl p-4">
        <p className="text-sm font-medium mb-3">Muscle Groups</p>
        <p className="text-xs text-muted text-center py-8">No active training plan</p>
      </div>
    );
  }

  const groupCounts: Record<string, number> = {};
  for (const day of plan.workoutDays) {
    if (day.restDay) continue;
    for (const exercise of day.exercises) {
      const group = exercise.muscleGroup;
      groupCounts[group] = (groupCounts[group] || 0) + 1;
    }
  }

  const data = Object.entries(groupCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  if (data.length === 0) {
    return (
      <div className="bg-card border border-card-border rounded-2xl p-4">
        <p className="text-sm font-medium mb-3">Muscle Groups</p>
        <p className="text-xs text-muted text-center py-8">No exercises in plan</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-card-border rounded-2xl p-4">
      <p className="text-sm font-medium mb-3">Muscle Groups</p>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={75}
            paddingAngle={2}
            dataKey="value"
            stroke="none"
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '12px', fontSize: '12px', color: '#fafafa' }}
            labelStyle={{ color: '#fafafa' }}
            itemStyle={{ color: '#fafafa' }}
            formatter={(value, name) => [`${value} exercises`, name]}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-1.5 mt-2">
        {data.map((entry, index) => {
          const total = data.reduce((s, d) => s + d.value, 0);
          const pct = Math.round((entry.value / total) * 100);
          return (
            <div key={entry.name} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
              <span className="text-[10px] text-muted capitalize">{entry.name} <span className="text-foreground font-medium">{pct}%</span></span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
