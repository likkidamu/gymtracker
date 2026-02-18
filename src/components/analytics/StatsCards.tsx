'use client';

import { FoodEntry } from '@/types/food';
import { TrainingPlan } from '@/types/training';
import { Card } from '@/components/ui/Card';
import { Flame, Utensils, Dumbbell, CalendarCheck } from 'lucide-react';
import { format, subDays } from 'date-fns';

interface StatsCardsProps {
  foodEntries: FoodEntry[];
  activePlan: TrainingPlan | null;
  weeklyWorkoutCount?: number;
  todayCaloriesBurned?: number;
}

export function StatsCards({ foodEntries, activePlan, weeklyWorkoutCount, todayCaloriesBurned }: StatsCardsProps) {
  // Calculate streak: consecutive days with at least 1 food entry, counting back from today
  const today = new Date();
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const dateStr = format(subDays(today, i), 'yyyy-MM-dd');
    const hasEntry = foodEntries.some((e) => e.date === dateStr);
    if (hasEntry) {
      streak++;
    } else {
      break;
    }
  }

  // Total meals tracked
  const totalMeals = foodEntries.length;

  const workoutsThisWeek = weeklyWorkoutCount ?? 0;
  const burnedToday = todayCaloriesBurned != null ? Math.round(todayCaloriesBurned) : 0;

  const stats = [
    { icon: CalendarCheck, label: 'Day Streak', value: streak, color: 'text-accent' },
    { icon: Utensils, label: 'Meals Logged', value: totalMeals, color: 'text-amber-500' },
    { icon: Dumbbell, label: 'Workouts/Wk', value: workoutsThisWeek, color: 'text-blue-500' },
    { icon: Flame, label: 'Burned Today', value: `${burnedToday}`, color: 'text-red-500' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map(({ icon: Icon, label, value, color }) => (
        <Card key={label}>
          <div className="flex items-center gap-2 mb-1">
            <Icon size={14} className={color} />
            <span className="text-[10px] text-muted uppercase tracking-wider">{label}</span>
          </div>
          <p className="text-2xl font-bold">{value}</p>
        </Card>
      ))}
    </div>
  );
}
