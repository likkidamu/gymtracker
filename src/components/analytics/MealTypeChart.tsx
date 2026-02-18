'use client';

import { FoodEntry, MealType } from '@/types/food';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface MealTypeChartProps {
  entries: FoodEntry[];
}

const MEAL_COLORS: Record<MealType, string> = {
  breakfast: '#f59e0b',
  lunch: '#84cc16',
  dinner: '#3b82f6',
  snack: '#a78bfa',
};

export function MealTypeChart({ entries }: MealTypeChartProps) {
  const mealTypes: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];

  const data = mealTypes.map((type) => {
    const typeEntries = entries.filter((e) => e.mealType === type);
    const calories = typeEntries.reduce((sum, e) => {
      return sum + (e.manualOverride?.calories ?? e.aiAnalysis?.totalCalories ?? 0);
    }, 0);
    return {
      meal: type.charAt(0).toUpperCase() + type.slice(1),
      calories: Math.round(calories),
      type,
    };
  });

  const hasData = data.some((d) => d.calories > 0);

  if (!hasData) {
    return (
      <div className="bg-card border border-card-border rounded-2xl p-4">
        <p className="text-sm font-medium mb-3">Calories by Meal</p>
        <p className="text-xs text-muted text-center py-8">No meal data yet</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-card-border rounded-2xl p-4">
      <p className="text-sm font-medium mb-3">Calories by Meal</p>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} layout="vertical">
          <XAxis type="number" tick={{ fontSize: 10, fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="meal" tick={{ fontSize: 11, fill: '#a1a1aa' }} axisLine={false} tickLine={false} width={70} />
          <Tooltip
            contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '12px', fontSize: '12px', color: '#fafafa' }}
            labelStyle={{ color: '#fafafa' }}
            itemStyle={{ color: '#fafafa' }}
            formatter={(value) => [`${value} kcal`, 'Calories']}
          />
          <Bar dataKey="calories" radius={[0, 6, 6, 0]} barSize={20}>
            {data.map((entry, index) => (
              <Cell key={index} fill={MEAL_COLORS[entry.type]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
