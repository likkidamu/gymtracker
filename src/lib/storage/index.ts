import { FoodEntry } from '@/types/food';
import { ProgressEntry } from '@/types/progress';
import { TrainingPlan } from '@/types/training';
import { WorkoutLog } from '@/types/workoutLog';
import { SupabaseStorageService } from './supabaseService';
import { IStorageService } from './types';

// --- Food mapping ---
function foodToDb(data: Partial<FoodEntry>): Record<string, unknown> {
  const map: Record<string, unknown> = {};
  if (data.photo !== undefined) map.photo = data.photo;
  if (data.thumbnail !== undefined) map.thumbnail = data.thumbnail;
  if (data.mealType !== undefined) map.meal_type = data.mealType;
  if (data.date !== undefined) map.date = data.date;
  if (data.description !== undefined) map.description = data.description;
  if (data.aiAnalysis !== undefined) map.ai_analysis = data.aiAnalysis;
  if (data.manualOverride !== undefined) map.manual_override = data.manualOverride;
  return map;
}

function foodFromDb(row: Record<string, unknown>): FoodEntry {
  return {
    id: row.id as string,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    photo: row.photo as string,
    thumbnail: row.thumbnail as string,
    mealType: row.meal_type as FoodEntry['mealType'],
    date: row.date as string,
    description: row.description as string | undefined,
    aiAnalysis: row.ai_analysis as FoodEntry['aiAnalysis'],
    manualOverride: row.manual_override as FoodEntry['manualOverride'],
  };
}

// --- Progress mapping ---
function progressToDb(data: Partial<ProgressEntry>): Record<string, unknown> {
  const map: Record<string, unknown> = {};
  if (data.photo !== undefined) map.photo = data.photo;
  if (data.thumbnail !== undefined) map.thumbnail = data.thumbnail;
  if (data.date !== undefined) map.date = data.date;
  if (data.weight !== undefined) map.weight = data.weight;
  if (data.bodyFatPercentage !== undefined) map.body_fat_percentage = data.bodyFatPercentage;
  if (data.measurements !== undefined) map.measurements = data.measurements;
  if (data.aiAnalysis !== undefined) map.ai_analysis = data.aiAnalysis;
  if (data.notes !== undefined) map.notes = data.notes;
  return map;
}

function progressFromDb(row: Record<string, unknown>): ProgressEntry {
  return {
    id: row.id as string,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    photo: row.photo as string,
    thumbnail: row.thumbnail as string,
    date: row.date as string,
    weight: row.weight as number | undefined,
    bodyFatPercentage: row.body_fat_percentage as number | undefined,
    measurements: row.measurements as ProgressEntry['measurements'],
    aiAnalysis: row.ai_analysis as ProgressEntry['aiAnalysis'],
    notes: row.notes as string | undefined,
  };
}

// --- Training mapping ---
function trainingToDb(data: Partial<TrainingPlan>): Record<string, unknown> {
  const map: Record<string, unknown> = {};
  if (data.name !== undefined) map.name = data.name;
  if (data.goal !== undefined) map.goal = data.goal;
  if (data.fitnessLevel !== undefined) map.fitness_level = data.fitnessLevel;
  if (data.daysPerWeek !== undefined) map.days_per_week = data.daysPerWeek;
  if (data.equipment !== undefined) map.equipment = data.equipment;
  if (data.duration !== undefined) map.duration = data.duration;
  if (data.workoutDays !== undefined) map.workout_days = data.workoutDays;
  if (data.isActive !== undefined) map.is_active = data.isActive;
  return map;
}

function trainingFromDb(row: Record<string, unknown>): TrainingPlan {
  return {
    id: row.id as string,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    name: row.name as string,
    goal: row.goal as TrainingPlan['goal'],
    fitnessLevel: row.fitness_level as TrainingPlan['fitnessLevel'],
    daysPerWeek: row.days_per_week as number,
    equipment: row.equipment as string[],
    duration: row.duration as string,
    workoutDays: row.workout_days as TrainingPlan['workoutDays'],
    isActive: row.is_active as boolean,
  };
}

// --- Factory exports (swapped from localStorage to Supabase!) ---
export const foodStorage: IStorageService<FoodEntry> =
  new SupabaseStorageService<FoodEntry>('food_entries', foodToDb, foodFromDb);

export const progressStorage: IStorageService<ProgressEntry> =
  new SupabaseStorageService<ProgressEntry>('progress_entries', progressToDb, progressFromDb);

export const trainingStorage: IStorageService<TrainingPlan> =
  new SupabaseStorageService<TrainingPlan>('training_plans', trainingToDb, trainingFromDb);

// --- Workout log mapping ---
function workoutLogToDb(data: Partial<WorkoutLog>): Record<string, unknown> {
  const map: Record<string, unknown> = {};
  if (data.trainingPlanId !== undefined) map.training_plan_id = data.trainingPlanId;
  if (data.trainingPlanName !== undefined) map.training_plan_name = data.trainingPlanName;
  if (data.dayNumber !== undefined) map.day_number = data.dayNumber;
  if (data.dayName !== undefined) map.day_name = data.dayName;
  if (data.date !== undefined) map.date = data.date;
  if (data.bodyWeightKg !== undefined) map.body_weight_kg = data.bodyWeightKg;
  if (data.exercises !== undefined) map.exercises = data.exercises;
  if (data.totalCalories !== undefined) map.total_calories = data.totalCalories;
  if (data.totalVolume !== undefined) map.total_volume = data.totalVolume;
  if (data.durationMinutes !== undefined) map.duration_minutes = data.durationMinutes;
  return map;
}

function workoutLogFromDb(row: Record<string, unknown>): WorkoutLog {
  return {
    id: row.id as string,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    trainingPlanId: row.training_plan_id as string,
    trainingPlanName: row.training_plan_name as string,
    dayNumber: row.day_number as number,
    dayName: row.day_name as string,
    date: row.date as string,
    bodyWeightKg: row.body_weight_kg as number,
    exercises: row.exercises as WorkoutLog['exercises'],
    totalCalories: row.total_calories as number,
    totalVolume: row.total_volume as number,
    durationMinutes: row.duration_minutes as number,
  };
}

export const workoutLogStorage: IStorageService<WorkoutLog> =
  new SupabaseStorageService<WorkoutLog>('workout_logs', workoutLogToDb, workoutLogFromDb);
