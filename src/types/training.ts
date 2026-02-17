import { BaseEntity } from './common';

export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';
export type TrainingGoal = 'muscle_gain' | 'fat_loss' | 'strength' | 'endurance' | 'general_fitness';

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  restSeconds: number;
  notes?: string;
  muscleGroup: string;
}

export interface WorkoutDay {
  dayNumber: number;
  name: string;
  focusMuscleGroups: string[];
  exercises: Exercise[];
  estimatedDuration: number;
  restDay: boolean;
}

export interface TrainingPlan extends BaseEntity {
  name: string;
  goal: TrainingGoal;
  fitnessLevel: FitnessLevel;
  daysPerWeek: number;
  equipment: string[];
  duration: string;
  workoutDays: WorkoutDay[];
  isActive: boolean;
}
