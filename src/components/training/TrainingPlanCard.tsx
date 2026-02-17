'use client';

import { TrainingPlan } from '@/types/training';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { TRAINING_GOALS } from '@/lib/utils/constants';
import { Star, Trash2, Dumbbell } from 'lucide-react';

interface TrainingPlanCardProps {
  plan: TrainingPlan;
  onActivate?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClick?: () => void;
}

export function TrainingPlanCard({ plan, onActivate, onDelete, onClick }: TrainingPlanCardProps) {
  const goalLabel = TRAINING_GOALS.find((g) => g.value === plan.goal)?.label || plan.goal;

  return (
    <Card className={`cursor-pointer hover:border-zinc-600 transition-colors ${plan.isActive ? 'border-accent/50' : ''}`} onClick={onClick}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold">{plan.name}</p>
            {plan.isActive && <Badge color="lime">Active</Badge>}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Badge color="blue">{goalLabel}</Badge>
            <Badge color="zinc">{plan.fitnessLevel}</Badge>
            <Badge color="zinc">{plan.daysPerWeek}d/wk</Badge>
          </div>
        </div>
      </div>
      <p className="text-xs text-muted mb-2">
        {plan.workoutDays.length} workouts • {plan.duration}
      </p>
      <div className="flex gap-2">
        {!plan.isActive && onActivate && (
          <Button
            size="sm"
            variant="secondary"
            onClick={(e) => { e.stopPropagation(); onActivate(plan.id); }}
          >
            <Star size={14} /> Set Active
          </Button>
        )}
        {onDelete && (
          <Button
            size="sm"
            variant="danger"
            onClick={(e) => { e.stopPropagation(); onDelete(plan.id); }}
          >
            <Trash2 size={14} />
          </Button>
        )}
      </div>
    </Card>
  );
}
