import { BaseEntity } from './common';

export interface ProgressMeasurements {
  chest?: number;
  waist?: number;
  hips?: number;
  biceps?: number;
  thighs?: number;
}

export interface MuscleGroupNote {
  group: string;
  note: string;
}

export interface ProgressAIAnalysis {
  observations: string;
  estimatedBodyFat: string;
  muscleGroupNotes: MuscleGroupNote[];
  comparisonNotes: string;
  recommendations: string[];
}

export interface ProgressEntry extends BaseEntity {
  photo: string;
  thumbnail: string;
  date: string;
  weight?: number;
  bodyFatPercentage?: number;
  measurements?: ProgressMeasurements;
  aiAnalysis?: ProgressAIAnalysis;
  notes?: string;
}
