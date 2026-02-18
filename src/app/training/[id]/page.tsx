'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { WorkoutDayView, WorkoutLogPayload } from '@/components/training/WorkoutDayView';
import { TrainingPlan } from '@/types/training';
import { trainingStorage } from '@/lib/storage';
import { TRAINING_GOALS } from '@/lib/utils/constants';
import { useProgress } from '@/hooks/useProgress';
import { useWorkoutLog } from '@/hooks/useWorkoutLog';
import { format } from 'date-fns';
import { Star, Dumbbell, ArrowRight, Scale } from 'lucide-react';

export default function TrainingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [plan, setPlan] = useState<TrainingPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const { getLatest } = useProgress();
  const { addLog } = useWorkoutLog();
  const [bodyWeight, setBodyWeight] = useState<number | null>(null);
  const [weightInitialized, setWeightInitialized] = useState(false);
  const [loggingDay, setLoggingDay] = useState<number | null>(null);
  const [loggedDays, setLoggedDays] = useState<Set<number>>(new Set());

  useEffect(() => {
    trainingStorage.getById(id).then((data) => {
      setPlan(data);
      setLoading(false);
    });
  }, [id]);

  // Seed body weight from latest progress entry (once)
  const latestWeight = getLatest()?.weight;
  useEffect(() => {
    if (!weightInitialized && latestWeight) {
      setBodyWeight(latestWeight);
      setWeightInitialized(true);
    }
  }, [latestWeight, weightInitialized]);

  const handleSetActive = async () => {
    if (!plan) return;
    // Deactivate all others
    const all = await trainingStorage.getAll();
    for (const p of all) {
      if (p.isActive && p.id !== plan.id) {
        await trainingStorage.update(p.id, { isActive: false });
      }
    }
    const updated = await trainingStorage.update(plan.id, { isActive: true });
    setPlan(updated);
  };

  const handleLogWorkout = async (payload: WorkoutLogPayload) => {
    if (!plan || !bodyWeight) return;
    setLoggingDay(payload.dayNumber);
    try {
      await addLog({
        trainingPlanId: plan.id,
        trainingPlanName: plan.name,
        dayNumber: payload.dayNumber,
        dayName: payload.dayName,
        date: format(new Date(), 'yyyy-MM-dd'),
        bodyWeightKg: bodyWeight,
        exercises: payload.exercises,
        totalCalories: payload.totalCalories,
        totalVolume: payload.totalVolume,
        durationMinutes: payload.durationMinutes,
      });
      setLoggedDays((prev) => new Set(prev).add(payload.dayNumber));
    } finally {
      setLoggingDay(null);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-[60vh]"><LoadingSpinner /></div>;
  if (!plan) return <div className="p-4 text-center text-muted">Plan not found</div>;

  const goalLabel = TRAINING_GOALS.find((g) => g.value === plan.goal)?.label || plan.goal;

  return (
    <>
      <Header title={plan.name} showBack />
      <div className="px-4 py-4 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {plan.isActive && <Badge color="lime">Active</Badge>}
          <Badge color="blue">{goalLabel}</Badge>
          <Badge color="zinc">{plan.fitnessLevel}</Badge>
          <Badge color="zinc">{plan.daysPerWeek}d/wk</Badge>
          <Badge color="zinc">{plan.duration}</Badge>
        </div>

        {plan.equipment.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {plan.equipment.map((eq) => (
              <span key={eq} className="px-2 py-1 bg-zinc-800 rounded-lg text-xs text-muted">{eq}</span>
            ))}
          </div>
        )}

        {!plan.isActive && (
          <Button onClick={handleSetActive} className="w-full">
            <Star size={16} /> Set as Active Plan
          </Button>
        )}

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Workout Days</p>
            <div className="flex items-center gap-2">
              <Scale size={14} className="text-muted" />
              <input
                type="number"
                value={bodyWeight ?? ''}
                onChange={(e) => setBodyWeight(e.target.value ? Math.max(1, Number(e.target.value)) : null)}
                placeholder="kg"
                className="w-16 bg-zinc-800 border border-card-border rounded-lg px-2 py-1 text-xs text-foreground text-center focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
              <span className="text-[10px] text-muted">kg</span>
            </div>
          </div>
          {!bodyWeight && (
            <p className="text-xs text-muted">Enter your weight to see calorie estimates. Tap any exercise to adjust sets & reps.</p>
          )}
          {plan.workoutDays.map((day) => (
            <WorkoutDayView
              key={day.dayNumber}
              day={day}
              bodyWeightKg={bodyWeight || undefined}
              onLogWorkout={handleLogWorkout}
              isLogging={loggingDay === day.dayNumber}
              isLogged={loggedDays.has(day.dayNumber)}
            />
          ))}
        </div>

        <Link
          href="/exercises"
          className="flex items-center justify-between p-4 bg-card border border-card-border rounded-2xl hover:border-accent/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-accent/10">
              <Dumbbell size={18} className="text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium">Exercise Explorer</p>
              <p className="text-xs text-muted">Muscles & calorie burn per exercise</p>
            </div>
          </div>
          <ArrowRight size={16} className="text-muted" />
        </Link>
      </div>
    </>
  );
}
