import { BaseEntity } from './common';

export interface LoggedExercise {
  name: string;
  muscleGroup: string;
  sets: number;
  reps: number;
  restSeconds: number;
  weightKg: number | null;
  caloriesBurned: number;
}

export interface WorkoutLog extends BaseEntity {
  trainingPlanId: string;
  trainingPlanName: string;
  dayNumber: number;
  dayName: string;
  date: string;
  bodyWeightKg: number;
  exercises: LoggedExercise[];
  totalCalories: number;
  totalVolume: number;
  durationMinutes: number;
}
