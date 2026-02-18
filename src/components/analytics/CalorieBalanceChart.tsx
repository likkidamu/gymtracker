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
  Legend,
} from 'recharts';

interface CalorieBalanceChartProps {
  foodEntries: FoodEntry[];
  dailyBurned: Record<string, number>;
}

export function CalorieBalanceChart({ foodEntries, dailyBurned }: CalorieBalanceChartProps) {
  const today = new Date();
  const days = eachDayOfInterval({ start: subDays(today, 6), end: today });

  const data = days.map((day) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const eaten = foodEntries
      .filter((e) => e.date === dateStr)
      .reduce((sum, e) => sum + (e.manualOverride?.calories ?? e.aiAnalysis?.totalCalories ?? 0), 0);
    return {
      day: format(day, 'EEE'),
      eaten: Math.round(eaten),
      burned: Math.round(dailyBurned[dateStr] ?? 0),
    };
  });

  const hasData = data.some((d) => d.eaten > 0 || d.burned > 0);

  if (!hasData) {
    return (
      <div className="bg-card border border-card-border rounded-2xl p-4">
        <p className="text-sm font-medium mb-3">Calories In vs Out</p>
        <p className="text-xs text-muted text-center py-8">Log meals and workouts to see your calorie balance!</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-card-border rounded-2xl p-4">
      <p className="text-sm font-medium mb-3">Calories In vs Out</p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
          <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#18181b',
              border: '1px solid #3f3f46',
              borderRadius: '12px',
              fontSize: '12px',
              color: '#fafafa',
            }}
            labelStyle={{ color: '#fafafa' }}
            formatter={(value) => [`${value} kcal`]}
          />
          <Legend
            formatter={(value: string) => (value === 'eaten' ? 'Eaten' : 'Burned')}
            wrapperStyle={{ fontSize: '10px' }}
          />
          <Bar dataKey="eaten" fill="#84cc16" radius={[4, 4, 0, 0]} />
          <Bar dataKey="burned" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
