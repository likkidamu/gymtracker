'use client';

import { useState, useEffect, useMemo } from 'react';
import { Flame } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { ExerciseInfo, CalorieBurnResult } from '@/types/exercise';
import { calculateCalorieBurn } from '@/lib/utils/calorieCalculator';

interface CalorieBurnCardProps {
  exercise: ExerciseInfo;
  initialWeight?: number;
  initialSets?: number;
  initialReps?: number;
  initialRest?: number;
}

export function CalorieBurnCard({
  exercise,
  initialWeight,
  initialSets,
  initialReps,
  initialRest,
}: CalorieBurnCardProps) {
  const [weightKg, setWeightKg] = useState(initialWeight || 70);
  const [sets, setSets] = useState(initialSets || 3);
  const [reps, setReps] = useState(initialReps || exercise.defaultRepsPerSet);
  const [rest, setRest] = useState(initialRest || 60);

  useEffect(() => {
    setReps(initialReps || exercise.defaultRepsPerSet);
    if (initialSets) setSets(initialSets);
    if (initialRest) setRest(initialRest);
  }, [exercise, initialReps, initialSets, initialRest]);

  useEffect(() => {
    if (initialWeight) setWeightKg(initialWeight);
  }, [initialWeight]);

  const result: CalorieBurnResult = useMemo(
    () =>
      calculateCalorieBurn({
        met: exercise.met,
        bodyWeightKg: weightKg,
        sets,
        repsPerSet: reps,
        secondsPerRep: exercise.secondsPerRep,
        restSeconds: rest,
      }),
    [exercise, weightKg, sets, reps, rest]
  );

  return (
    <Card className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-red-500/10">
          <Flame size={16} className="text-red-500" />
        </div>
        <p className="text-sm font-medium">Calorie Burn Estimate</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="block text-xs text-muted">Weight (kg)</label>
          <input
            type="number"
            value={weightKg}
            onChange={(e) => setWeightKg(Math.max(1, Number(e.target.value)))}
            className="w-full bg-zinc-800 border border-card-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs text-muted">Sets</label>
          <input
            type="number"
            value={sets}
            onChange={(e) => setSets(Math.max(1, Number(e.target.value)))}
            className="w-full bg-zinc-800 border border-card-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs text-muted">Reps per Set</label>
          <input
            type="number"
            value={reps}
            onChange={(e) => setReps(Math.max(1, Number(e.target.value)))}
            className="w-full bg-zinc-800 border border-card-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs text-muted">Rest (sec)</label>
          <input
            type="number"
            value={rest}
            onChange={(e) => setRest(Math.max(0, Number(e.target.value)))}
            className="w-full bg-zinc-800 border border-card-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>
      </div>

      <div className="bg-zinc-800/50 rounded-xl p-4">
        <div className="text-center">
          <p className="text-3xl font-bold text-accent">{result.totalCalories}</p>
          <p className="text-xs text-muted mt-1">estimated kcal</p>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-3 text-center">
          <div>
            <p className="text-sm font-medium">{result.activeCalories}</p>
            <p className="text-[10px] text-muted">Active kcal</p>
          </div>
          <div>
            <p className="text-sm font-medium">{result.restCalories}</p>
            <p className="text-[10px] text-muted">Rest kcal</p>
          </div>
          <div>
            <p className="text-sm font-medium">{result.totalMinutes}</p>
            <p className="text-[10px] text-muted">Total min</p>
          </div>
        </div>
      </div>

      <p className="text-[10px] text-zinc-500 text-center">
        MET {exercise.met} · NASM formula · {exercise.secondsPerRep}s per rep
      </p>
    </Card>
  );
}
