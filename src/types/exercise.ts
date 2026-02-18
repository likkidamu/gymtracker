export type MuscleGroupId =
  | 'chest'
  | 'front_delts'
  | 'side_delts'
  | 'rear_delts'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'abs'
  | 'obliques'
  | 'quads'
  | 'hamstrings'
  | 'glutes'
  | 'calves'
  | 'traps'
  | 'lats'
  | 'lower_back';

export type ExerciseCategory =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'arms'
  | 'legs'
  | 'core'
  | 'full_body'
  | 'cardio';

export interface ExerciseInfo {
  id: string;
  name: string;
  category: ExerciseCategory;
  met: number;
  primaryMuscles: MuscleGroupId[];
  secondaryMuscles: MuscleGroupId[];
  description: string;
  defaultRepsPerSet: number;
  secondsPerRep: number;
}

export interface CalorieBurnResult {
  totalCalories: number;
  activeCalories: number;
  restCalories: number;
  activeMinutes: number;
  restMinutes: number;
  totalMinutes: number;
}
