'use client';

import { useState, useMemo, useCallback } from 'react';
import { WorkoutDay } from '@/types/training';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ExerciseItem, ExerciseOverrides } from './ExerciseItem';
import { ChevronDown, ChevronUp, Clock, Flame, Check, Loader2 } from 'lucide-react';
import { findExerciseMatch, DEFAULT_EXERCISE } from '@/data/exerciseDatabase';
import { calculateCalorieBurn } from '@/lib/utils/calorieCalculator';
import { LoggedExercise } from '@/types/workoutLog';

export interface WorkoutLogPayload {
  dayNumber: number;
  dayName: string;
  exercises: LoggedExercise[];
  totalCalories: number;
  totalVolume: number;
  durationMinutes: number;
}

interface WorkoutDayViewProps {
  day: WorkoutDay;
  bodyWeightKg?: number;
  onLogWorkout?: (payload: WorkoutLogPayload) => Promise<void>;
  isLogging?: boolean;
  isLogged?: boolean;
}

export function WorkoutDayView({ day, bodyWeightKg, onLogWorkout, isLogging, isLogged }: WorkoutDayViewProps) {
  const [expanded, setExpanded] = useState(false);
  const [overridesMap, setOverridesMap] = useState<Record<number, ExerciseOverrides>>({});

  const handleOverridesChange = useCallback((index: number, overrides: ExerciseOverrides) => {
    setOverridesMap((prev) => ({ ...prev, [index]: overrides }));
  }, []);

  const dayCalories = useMemo(() => {
    if (!bodyWeightKg) return null;
    let total = 0;
    for (let i = 0; i < day.exercises.length; i++) {
      const ex = day.exercises[i];
      const ov = overridesMap[i];
      const match = findExerciseMatch(ex.name) || DEFAULT_EXERCISE;
      const planReps = parseInt(ex.reps, 10);
      const result = calculateCalorieBurn({
        met: match.met,
        bodyWeightKg,
        sets: ov?.sets ?? ex.sets,
        repsPerSet: ov?.reps ?? (isNaN(planReps) ? match.defaultRepsPerSet : planReps),
        secondsPerRep: match.secondsPerRep,
        restSeconds: ov?.rest ?? ex.restSeconds,
        liftWeightKg: ov?.weight,
      });
      total += result.totalCalories;
    }
    return Math.round(total);
  }, [day.exercises, bodyWeightKg, overridesMap]);

  if (day.restDay) {
    return (
      <Card className="opacity-60">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Day {day.dayNumber}: {day.name}</p>
            <p className="text-xs text-muted">Rest & Recovery</p>
          </div>
          <Badge color="green">Rest Day</Badge>
        </div>
      </Card>
    );
  }

  return (
    <Card padding={false}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 cursor-pointer"
      >
        <div className="text-left">
          <p className="text-sm font-medium">Day {day.dayNumber}: {day.name}</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1 text-xs text-muted">
              <Clock size={12} />
              {day.estimatedDuration} min
            </div>
            <span className="text-xs text-muted">·</span>
            <span className="text-xs text-muted">{day.exercises.length} exercises</span>
            {dayCalories !== null && (
              <>
                <span className="text-xs text-muted">·</span>
                <div className="flex items-center gap-1 text-xs text-red-400">
                  <Flame size={12} />
                  {dayCalories} kcal
                </div>
              </>
            )}
          </div>
          <div className="flex flex-wrap gap-1 mt-1.5">
            {day.focusMuscleGroups.map((g) => (
              <Badge key={g} color="lime">{g}</Badge>
            ))}
          </div>
        </div>
        {expanded ? <ChevronUp size={18} className="text-muted" /> : <ChevronDown size={18} className="text-muted" />}
      </button>
      {expanded && (
        <div className="px-4 pb-4 border-t border-card-border">
          <div className="divide-y divide-zinc-800">
            {day.exercises.map((ex, i) => (
              <ExerciseItem
                key={i}
                exercise={ex}
                index={i}
                bodyWeightKg={bodyWeightKg}
                overrides={overridesMap[i]}
                onOverridesChange={(ov) => handleOverridesChange(i, ov)}
              />
            ))}
          </div>
          {dayCalories !== null && (
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-800">
              <div className="flex items-center gap-1.5">
                <Flame size={14} className="text-red-400" />
                <span className="text-sm font-semibold text-red-400">{dayCalories} kcal</span>
                <span className="text-xs text-muted">estimated total</span>
              </div>
              {onLogWorkout && bodyWeightKg && (
                <button
                  disabled={isLogging || isLogged}
                  onClick={() => {
                    const loggedExercises: LoggedExercise[] = day.exercises.map((ex, i) => {
                      const ov = overridesMap[i];
                      const match = findExerciseMatch(ex.name) || DEFAULT_EXERCISE;
                      const planReps = parseInt(ex.reps, 10);
                      const sets = ov?.sets ?? ex.sets;
                      const reps = ov?.reps ?? (isNaN(planReps) ? match.defaultRepsPerSet : planReps);
                      const rest = ov?.rest ?? ex.restSeconds;
                      const weight = ov?.weight ?? null;
                      const result = calculateCalorieBurn({
                        met: match.met,
                        bodyWeightKg: bodyWeightKg!,
                        sets,
                        repsPerSet: reps,
                        secondsPerRep: match.secondsPerRep,
                        restSeconds: rest,
                        liftWeightKg: weight,
                      });
                      return {
                        name: ex.name,
                        muscleGroup: ex.muscleGroup,
                        sets,
                        reps,
                        restSeconds: rest,
                        weightKg: weight,
                        caloriesBurned: result.totalCalories,
                      };
                    });
                    const totalCalories = loggedExercises.reduce((s, e) => s + e.caloriesBurned, 0);
                    const totalVolume = loggedExercises.reduce(
                      (s, e) => s + e.sets * e.reps * (e.weightKg ?? 0),
                      0
                    );
                    const durationMinutes = loggedExercises.reduce((s, e) => {
                      const match = findExerciseMatch(e.name) || DEFAULT_EXERCISE;
                      const result = calculateCalorieBurn({
                        met: match.met,
                        bodyWeightKg: bodyWeightKg!,
                        sets: e.sets,
                        repsPerSet: e.reps,
                        secondsPerRep: match.secondsPerRep,
                        restSeconds: e.restSeconds,
                        liftWeightKg: e.weightKg,
                      });
                      return s + result.totalMinutes;
                    }, 0);
                    onLogWorkout({
                      dayNumber: day.dayNumber,
                      dayName: day.name,
                      exercises: loggedExercises,
                      totalCalories: Math.round(totalCalories),
                      totalVolume: Math.round(totalVolume),
                      durationMinutes: Math.round(durationMinutes),
                    });
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    isLogged
                      ? 'bg-green-500/10 text-green-500 cursor-default'
                      : 'bg-accent text-zinc-900 hover:bg-accent-dark cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                >
                  {isLogging ? (
                    <><Loader2 size={12} className="animate-spin" /> Logging...</>
                  ) : isLogged ? (
                    <><Check size={12} /> Logged</>
                  ) : (
                    <>Log Workout ({dayCalories} kcal)</>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
