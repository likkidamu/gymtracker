'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { WorkoutDayView } from '@/components/training/WorkoutDayView';
import { TrainingPlan } from '@/types/training';
import { trainingStorage } from '@/lib/storage';
import { TRAINING_GOALS } from '@/lib/utils/constants';
import { Star } from 'lucide-react';

export default function TrainingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [plan, setPlan] = useState<TrainingPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trainingStorage.getById(id).then((data) => {
      setPlan(data);
      setLoading(false);
    });
  }, [id]);

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
          <p className="text-sm font-medium">Workout Days</p>
          {plan.workoutDays.map((day) => (
            <WorkoutDayView key={day.dayNumber} day={day} />
          ))}
        </div>
      </div>
    </>
  );
}
