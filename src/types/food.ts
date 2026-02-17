import { BaseEntity } from './common';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface MacroNutrients {
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface FoodItem {
  name: string;
  calories: number;
  portion: string;
  macros: MacroNutrients;
}

export interface FoodAIAnalysis {
  foodItems: FoodItem[];
  totalCalories: number;
  totalMacros: MacroNutrients;
  mealRating: number;
  healthNotes: string;
}

export interface FoodEntry extends BaseEntity {
  photo: string;
  thumbnail: string;
  mealType: MealType;
  date: string;
  description?: string;
  aiAnalysis?: FoodAIAnalysis;
  manualOverride?: {
    calories?: number;
    macros?: Partial<MacroNutrients>;
  };
}
