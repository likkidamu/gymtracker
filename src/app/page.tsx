'use client';

import { useFood } from '@/hooks/useFood';
import { useProgress } from '@/hooks/useProgress';
import { useTraining } from '@/hooks/useTraining';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Utensils, TrendingUp, Dumbbell, Plus, Flame, Zap, LogOut } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { loading: foodLoading, getTodayTotals, getTodayEntries } = useFood();
  const { loading: progressLoading, getLatest } = useProgress();
  const { loading: trainingLoading, getActivePlan } = useTraining();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const loading = foodLoading || progressLoading || trainingLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <LoadingSpinner text="Loading dashboard..." />
      </div>
    );
  }

  const todayTotals = getTodayTotals();
  const todayMeals = getTodayEntries();
  const latestProgress = getLatest();
  const activePlan = getActivePlan();

  return (
    <div className="px-4 py-6 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold">GymTracker</h1>
          <p className="text-sm text-muted">Your AI-powered fitness companion</p>
        </div>
        <button onClick={handleLogout} className="p-2 text-muted hover:text-foreground rounded-xl hover:bg-zinc-800 cursor-pointer">
          <LogOut size={20} />
        </button>
      </div>

      {/* Today's Calories */}
      <Card className="bg-gradient-to-br from-zinc-900 to-zinc-800">
        <div className="flex items-center gap-2 mb-2">
          <Flame size={18} className="text-accent" />
          <span className="text-xs text-muted uppercase tracking-wider">Today&apos;s Intake</span>
        </div>
        <div className="text-4xl font-bold text-accent mb-1">
          {Math.round(todayTotals.calories)}
          <span className="text-lg font-normal text-muted ml-1">kcal</span>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-3">
          <div>
            <p className="text-sm font-semibold text-blue-500">{Math.round(todayTotals.protein)}g</p>
            <p className="text-xs text-muted">Protein</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-amber-500">{Math.round(todayTotals.carbs)}g</p>
            <p className="text-xs text-muted">Carbs</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-red-500">{Math.round(todayTotals.fat)}g</p>
            <p className="text-xs text-muted">Fat</p>
          </div>
        </div>
        <div className="mt-3 text-xs text-muted">
          {todayMeals.length} meal{todayMeals.length !== 1 ? 's' : ''} logged today
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        <Link href="/food">
          <Card className="text-center hover:border-zinc-600 transition-colors">
            <Utensils size={20} className="mx-auto text-amber-500 mb-1.5" />
            <p className="text-xs font-medium">Log Meal</p>
          </Card>
        </Link>
        <Link href="/progress">
          <Card className="text-center hover:border-zinc-600 transition-colors">
            <TrendingUp size={20} className="mx-auto text-blue-500 mb-1.5" />
            <p className="text-xs font-medium">Progress</p>
          </Card>
        </Link>
        <Link href="/training">
          <Card className="text-center hover:border-zinc-600 transition-colors">
            <Dumbbell size={20} className="mx-auto text-accent mb-1.5" />
            <p className="text-xs font-medium">Training</p>
          </Card>
        </Link>
      </div>

      {/* Active Plan */}
      {activePlan ? (
        <Link href={`/training/${activePlan.id}`}>
          <Card className="hover:border-zinc-600 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={16} className="text-accent" />
              <span className="text-xs text-muted uppercase tracking-wider">Active Plan</span>
            </div>
            <p className="text-sm font-semibold">{activePlan.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge color="lime">{activePlan.daysPerWeek}d/wk</Badge>
              <Badge color="zinc">{activePlan.duration}</Badge>
              <span className="text-xs text-muted">{activePlan.workoutDays.length} workouts</span>
            </div>
          </Card>
        </Link>
      ) : (
        <Card className="text-center py-6">
          <Dumbbell size={24} className="mx-auto text-muted mb-2" />
          <p className="text-sm text-muted mb-3">No active training plan</p>
          <Link href="/training">
            <Button size="sm"><Plus size={14} /> Generate one</Button>
          </Link>
        </Card>
      )}

      {/* Latest Progress */}
      {latestProgress && (
        <Link href={`/progress/${latestProgress.id}`}>
          <Card className="hover:border-zinc-600 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="text-blue-500" />
              <span className="text-xs text-muted uppercase tracking-wider">Latest Progress</span>
            </div>
            <div className="flex gap-3">
              <img
                src={latestProgress.thumbnail || latestProgress.photo}
                alt="Progress"
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div>
                <p className="text-sm font-medium">{latestProgress.date}</p>
                {latestProgress.weight && (
                  <p className="text-sm text-accent">{latestProgress.weight} kg</p>
                )}
                {latestProgress.aiAnalysis?.estimatedBodyFat && (
                  <p className="text-xs text-muted">BF: {latestProgress.aiAnalysis.estimatedBodyFat}</p>
                )}
              </div>
            </div>
          </Card>
        </Link>
      )}
    </div>
  );
}
