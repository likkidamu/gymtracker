'use client';

import { FoodEntry } from '@/types/food';
import { subDays, format, eachDayOfInterval } from 'date-fns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';

interface WeeklyCalorieChartProps {
  entries: FoodEntry[];
  targetCalories?: number;
}

export function WeeklyCalorieChart({ entries, targetCalories = 2000 }: WeeklyCalorieChartProps) {
  const today = new Date();
  const days = eachDayOfInterval({ start: subDays(today, 6), end: today });

  const data = days.map((day) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const dayEntries = entries.filter((e) => e.date === dateStr);
    const calories = dayEntries.reduce((sum, e) => {
      return sum + (e.manualOverride?.calories ?? e.aiAnalysis?.totalCalories ?? 0);
    }, 0);
    return {
      day: format(day, 'EEE'),
      calories: Math.round(calories),
    };
  });

  const getBarColor = (calories: number) => {
    if (calories === 0) return '#3f3f46';
    const lower = targetCalories * 0.85;
    const upper = targetCalories * 1.15;
    if (calories >= lower && calories <= upper) return '#84cc16';
    return '#f59e0b';
  };

  if (entries.length === 0) {
    return (
      <div className="bg-card border border-card-border rounded-2xl p-4">
        <p className="text-sm font-medium mb-3">Weekly Calories</p>
        <p className="text-xs text-muted text-center py-8">No food entries yet. Start logging meals!</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-card-border rounded-2xl p-4">
      <p className="text-sm font-medium mb-3">Weekly Calories</p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
          <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '12px', fontSize: '12px', color: '#fafafa' }}
            labelStyle={{ color: '#fafafa' }}
            itemStyle={{ color: '#fafafa' }}
            formatter={(value) => [`${value} kcal`, 'Calories']}
          />
          {targetCalories > 0 && (
            <ReferenceLine y={targetCalories} stroke="#84cc16" strokeDasharray="4 4" strokeOpacity={0.5} />
          )}
          <Bar dataKey="calories" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill={getBarColor(entry.calories)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
