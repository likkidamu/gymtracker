'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Flame, ArrowRight } from 'lucide-react';
import { useFood } from '@/hooks/useFood';
import { useProgress } from '@/hooks/useProgress';
import { useTraining } from '@/hooks/useTraining';
import { useWorkoutLog } from '@/hooks/useWorkoutLog';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { WeeklyCalorieChart } from '@/components/analytics/WeeklyCalorieChart';
import { CalorieBalanceChart } from '@/components/analytics/CalorieBalanceChart';
import { MacroDonutChart } from '@/components/analytics/MacroDonutChart';
import { MealTypeChart } from '@/components/analytics/MealTypeChart';
import { MeasurementsRadar } from '@/components/analytics/MeasurementsRadar';
import { MuscleGroupChart } from '@/components/analytics/MuscleGroupChart';
import { StatsCards } from '@/components/analytics/StatsCards';
import { BodyMetricsChart } from '@/components/progress/BodyMetricsChart';
import { ProgressEntry } from '@/types/progress';
import { subDays, subMonths } from 'date-fns';

type Period = '1w' | '1m' | '3m' | 'all';

function filterByPeriod(entries: ProgressEntry[], period: Period): ProgressEntry[] {
  if (period === 'all') return entries;
  const now = new Date();
  const cutoff =
    period === '1w' ? subDays(now, 7) : period === '1m' ? subMonths(now, 1) : subMonths(now, 3);
  return entries.filter((e) => new Date(e.date) >= cutoff);
}

export default function AnalyticsPage() {
  const { entries: foodEntries, loading: foodLoading, getTodayTotals } = useFood();
  const { entries: progressEntries, loading: progressLoading } = useProgress();
  const { loading: trainingLoading, getActivePlan } = useTraining();
  const {
    loading: workoutLogLoading,
    getTodayCaloriesBurned,
    getWeeklyWorkoutCount,
    getDailyCaloriesBurned,
  } = useWorkoutLog();
  const [period, setPeriod] = useState<Period>('1m');

  const loading = foodLoading || progressLoading || trainingLoading || workoutLogLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <LoadingSpinner text="Loading analytics..." />
      </div>
    );
  }

  const todayTotals = getTodayTotals();
  const activePlan = getActivePlan();
  const filteredProgress = filterByPeriod(progressEntries, period);
  const periods: { value: Period; label: string }[] = [
    { value: '1w', label: '1W' },
    { value: '1m', label: '1M' },
    { value: '3m', label: '3M' },
    { value: 'all', label: 'All' },
  ];

  return (
    <div className="px-4 py-6 space-y-4 pb-24">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-muted">Track your fitness journey</p>
      </div>

      <StatsCards
        foodEntries={foodEntries}
        activePlan={activePlan}
        weeklyWorkoutCount={getWeeklyWorkoutCount()}
        todayCaloriesBurned={getTodayCaloriesBurned()}
      />

      <WeeklyCalorieChart entries={foodEntries} />

      <CalorieBalanceChart foodEntries={foodEntries} dailyBurned={getDailyCaloriesBurned(7)} />

      <div className="grid grid-cols-2 gap-3">
        <MacroDonutChart
          protein={todayTotals.protein}
          carbs={todayTotals.carbs}
          fat={todayTotals.fat}
          totalCalories={todayTotals.calories}
        />
        <MealTypeChart entries={foodEntries.filter((e) => e.date === new Date().toISOString().split('T')[0])} />
      </div>

      {/* Weight & Body Fat Trend with period selector */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium">Weight & Body Fat</p>
          <div className="flex gap-1">
            {periods.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${
                  period === p.value
                    ? 'bg-accent text-zinc-900 font-semibold'
                    : 'bg-zinc-800 text-muted hover:text-foreground'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <BodyMetricsChart entries={filteredProgress} />
        {filteredProgress.filter((e) => e.weight).length < 2 && (
          <p className="text-xs text-muted text-center mt-2">Log at least 2 weight entries to see trends</p>
        )}
      </div>

      <MeasurementsRadar entries={progressEntries} />

      <MuscleGroupChart plan={activePlan} />

      <Link
        href="/exercises"
        className="flex items-center justify-between p-4 bg-card border border-card-border rounded-2xl hover:border-accent/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-red-500/10">
            <Flame size={18} className="text-red-500" />
          </div>
          <div>
            <p className="text-sm font-medium">Calorie Burn Calculator</p>
            <p className="text-xs text-muted">Estimate kcal per exercise</p>
          </div>
        </div>
        <ArrowRight size={16} className="text-muted" />
      </Link>
    </div>
  );
}
