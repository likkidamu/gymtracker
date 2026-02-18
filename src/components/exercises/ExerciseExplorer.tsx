'use client';

import { useState, useMemo } from 'react';
import { Dumbbell } from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';
import { useTraining } from '@/hooks/useTraining';
import { ExerciseInfo } from '@/types/exercise';
import { findExerciseMatch } from '@/data/exerciseDatabase';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ExerciseSelector } from './ExerciseSelector';
import { ExerciseDetailCard } from './ExerciseDetailCard';
import { CalorieBurnCard } from './CalorieBurnCard';
import { MuscleBodyMap } from './MuscleBodyMap';
import { MuscleGroupLegend } from './MuscleGroupLegend';

interface PlanExerciseData {
  exercise: ExerciseInfo;
  sets?: number;
  reps?: number;
  rest?: number;
}

export function ExerciseExplorer() {
  const { getLatest } = useProgress();
  const { getActivePlan } = useTraining();
  const [selected, setSelected] = useState<ExerciseInfo | null>(null);
  const [planData, setPlanData] = useState<{ sets?: number; reps?: number; rest?: number }>({});

  const latestWeight = getLatest()?.weight;
  const activePlan = getActivePlan();

  // Build plan exercises with matched data
  const planExercises = useMemo(() => {
    if (!activePlan) return [] as PlanExerciseData[];
    const seen = new Set<string>();
    const results: PlanExerciseData[] = [];

    for (const day of activePlan.workoutDays) {
      if (day.restDay) continue;
      for (const ex of day.exercises) {
        const match = findExerciseMatch(ex.name);
        if (match && !seen.has(match.id)) {
          seen.add(match.id);
          const repsNum = parseInt(ex.reps, 10);
          results.push({
            exercise: match,
            sets: ex.sets,
            reps: isNaN(repsNum) ? undefined : repsNum,
            rest: ex.restSeconds,
          });
        }
      }
    }
    return results;
  }, [activePlan]);

  const handleSelect = (exercise: ExerciseInfo) => {
    setSelected(exercise);
    // Check if this exercise has plan data
    const pd = planExercises.find((pe) => pe.exercise.id === exercise.id);
    setPlanData(pd ? { sets: pd.sets, reps: pd.reps, rest: pd.rest } : {});
  };

  return (
    <div className="space-y-4">
      <Card>
        <ExerciseSelector
          selectedId={selected?.id || null}
          onSelect={handleSelect}
          planExercises={planExercises.map((pe) => pe.exercise)}
        />
      </Card>

      {selected ? (
        <>
          <ExerciseDetailCard exercise={selected} />

          <Card className="space-y-3">
            <p className="text-sm font-medium">Muscle Map</p>
            <MuscleBodyMap
              primaryMuscles={selected.primaryMuscles}
              secondaryMuscles={selected.secondaryMuscles}
            />
            <MuscleGroupLegend />
          </Card>

          <CalorieBurnCard
            exercise={selected}
            initialWeight={latestWeight}
            initialSets={planData.sets}
            initialReps={planData.reps}
            initialRest={planData.rest}
          />
        </>
      ) : (
        <EmptyState
          icon={Dumbbell}
          title="Select an Exercise"
          description="Choose an exercise above to see which muscles it targets and estimate calories burned."
        />
      )}
    </div>
  );
}
