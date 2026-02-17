import { FoodAIAnalysis } from '@/types/food';
import { ProgressAIAnalysis } from '@/types/progress';
import { WorkoutDay } from '@/types/training';

function cleanJsonString(raw: string): string {
  // Strip markdown code fences
  return raw.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
}

export function parseFoodAnalysis(raw: string): FoodAIAnalysis {
  const data = JSON.parse(cleanJsonString(raw));
  return {
    foodItems: data.foodItems || [],
    totalCalories: data.totalCalories || 0,
    totalMacros: {
      protein: data.totalMacros?.protein || 0,
      carbs: data.totalMacros?.carbs || 0,
      fat: data.totalMacros?.fat || 0,
      fiber: data.totalMacros?.fiber || 0,
    },
    mealRating: data.mealRating || 5,
    healthNotes: data.healthNotes || '',
  };
}

export function parseProgressAnalysis(raw: string): ProgressAIAnalysis {
  const data = JSON.parse(cleanJsonString(raw));
  return {
    observations: data.observations || '',
    estimatedBodyFat: data.estimatedBodyFat || 'Unknown',
    muscleGroupNotes: data.muscleGroupNotes || [],
    comparisonNotes: data.comparisonNotes || '',
    recommendations: data.recommendations || [],
  };
}

export function parseTrainingPlan(raw: string): { name: string; duration: string; workoutDays: WorkoutDay[] } {
  const data = JSON.parse(cleanJsonString(raw));
  return {
    name: data.name || 'Custom Plan',
    duration: data.duration || '4 weeks',
    workoutDays: (data.workoutDays || []).map((day: WorkoutDay, i: number) => ({
      dayNumber: day.dayNumber || i + 1,
      name: day.name || `Day ${i + 1}`,
      focusMuscleGroups: day.focusMuscleGroups || [],
      exercises: (day.exercises || []).map((ex) => ({
        name: ex.name || 'Exercise',
        sets: ex.sets || 3,
        reps: ex.reps || '10',
        restSeconds: ex.restSeconds || 60,
        notes: ex.notes || '',
        muscleGroup: ex.muscleGroup || '',
      })),
      estimatedDuration: day.estimatedDuration || 60,
      restDay: day.restDay || false,
    })),
  };
}
