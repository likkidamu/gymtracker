'use client';

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface MacroDonutChartProps {
  protein: number;
  carbs: number;
  fat: number;
  totalCalories: number;
}

const COLORS = { protein: '#3b82f6', carbs: '#f59e0b', fat: '#ef4444' };

export function MacroDonutChart({ protein, carbs, fat, totalCalories }: MacroDonutChartProps) {
  const data = [
    { name: 'Protein', value: protein, color: COLORS.protein },
    { name: 'Carbs', value: carbs, color: COLORS.carbs },
    { name: 'Fat', value: fat, color: COLORS.fat },
  ];

  const hasData = protein > 0 || carbs > 0 || fat > 0;

  if (!hasData) {
    return (
      <div className="bg-card border border-card-border rounded-2xl p-4">
        <p className="text-sm font-medium mb-3">Macro Distribution</p>
        <p className="text-xs text-muted text-center py-8">No macro data yet</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-card-border rounded-2xl p-4">
      <p className="text-sm font-medium mb-3">Macro Distribution</p>
      <div className="relative">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={75}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-bold">{Math.round(totalCalories)}</p>
            <p className="text-[10px] text-muted">kcal</p>
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-4 mt-2">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-xs text-muted">
              {entry.name} <span className="text-foreground font-medium">{Math.round(entry.value)}g</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
