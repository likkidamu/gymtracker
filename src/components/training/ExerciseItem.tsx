'use client';

import { useState, useMemo } from 'react';
import { Flame, ChevronDown, ChevronUp } from 'lucide-react';
import { Exercise } from '@/types/training';
import { Badge } from '@/components/ui/Badge';
import { findExerciseMatch, DEFAULT_EXERCISE } from '@/data/exerciseDatabase';
import { calculateCalorieBurn } from '@/lib/utils/calorieCalculator';

export interface ExerciseOverrides {
  sets: number;
  reps: number;
  rest: number;
  weight: number | null;
}

interface ExerciseItemProps {
  exercise: Exercise;
  index: number;
  bodyWeightKg?: number;
  overrides?: ExerciseOverrides;
  onOverridesChange?: (overrides: ExerciseOverrides) => void;
}

export function ExerciseItem({ exercise, index, bodyWeightKg, overrides, onOverridesChange }: ExerciseItemProps) {
  const [open, setOpen] = useState(false);

  const planReps = parseInt(exercise.reps, 10);
  const sets = overrides?.sets ?? exercise.sets;
  const reps = overrides?.reps ?? (isNaN(planReps) ? 10 : planReps);
  const rest = overrides?.rest ?? exercise.restSeconds;
  const liftWeight = overrides?.weight ?? null;

  const match = useMemo(() => findExerciseMatch(exercise.name) || DEFAULT_EXERCISE, [exercise.name]);

  const calories = useMemo(() => {
    if (!bodyWeightKg) return null;
    return calculateCalorieBurn({
      met: match.met,
      bodyWeightKg,
      sets,
      repsPerSet: reps,
      secondsPerRep: match.secondsPerRep,
      restSeconds: rest,
      liftWeightKg: liftWeight,
    });
  }, [match, bodyWeightKg, sets, reps, rest, liftWeight]);

  const update = (field: keyof ExerciseOverrides, value: number | null) => {
    onOverridesChange?.({ sets, reps, rest, weight: liftWeight, [field]: value });
  };

  const hasOverride = overrides !== undefined;

  return (
    <div className="py-2">
      <div
        className="flex items-start gap-3 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <span className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center text-xs text-muted flex-shrink-0 mt-0.5">
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{exercise.name}</p>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            {liftWeight && (
              <span className="text-xs text-amber-400 font-medium">{liftWeight}kg</span>
            )}
            <span className={`text-xs ${hasOverride ? 'text-amber-400' : 'text-accent'}`}>
              {sets} × {reps}
            </span>
            <span className="text-xs text-muted">Rest: {rest}s</span>
            {exercise.muscleGroup && <Badge color="zinc">{exercise.muscleGroup}</Badge>}
          </div>
          {exercise.notes && <p className="text-xs text-muted mt-0.5">{exercise.notes}</p>}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 mt-1">
          {calories && (
            <div className="flex items-center gap-1 text-xs text-red-400">
              <Flame size={12} />
              <span>{calories.totalCalories}</span>
            </div>
          )}
          {open ? <ChevronUp size={14} className="text-muted" /> : <ChevronDown size={14} className="text-muted" />}
        </div>
      </div>

      {open && (
        <div className="ml-9 mt-2 grid grid-cols-4 gap-2" onClick={(e) => e.stopPropagation()}>
          <div className="space-y-1">
            <label className="block text-[10px] text-muted">Weight (kg)</label>
            <input
              type="number"
              value={liftWeight ?? ''}
              placeholder="—"
              onChange={(e) => update('weight', e.target.value ? Math.max(0, Number(e.target.value)) : null)}
              className="w-full bg-zinc-800 border border-card-border rounded-lg px-2 py-1.5 text-xs text-foreground placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] text-muted">Sets</label>
            <input
              type="number"
              value={sets}
              onChange={(e) => update('sets', Math.max(1, Number(e.target.value)))}
              className="w-full bg-zinc-800 border border-card-border rounded-lg px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] text-muted">Reps</label>
            <input
              type="number"
              value={reps}
              onChange={(e) => update('reps', Math.max(1, Number(e.target.value)))}
              className="w-full bg-zinc-800 border border-card-border rounded-lg px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] text-muted">Rest (s)</label>
            <input
              type="number"
              value={rest}
              onChange={(e) => update('rest', Math.max(0, Number(e.target.value)))}
              className="w-full bg-zinc-800 border border-card-border rounded-lg px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>
          {calories && (
            <div className="col-span-4 flex items-center gap-3 text-[10px] text-muted mt-1">
              <span>Active: {calories.activeCalories} kcal ({calories.activeMinutes} min)</span>
              <span>Rest: {calories.restCalories} kcal ({calories.restMinutes} min)</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
