'use client';

import { FoodEntry } from '@/types/food';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MacroBreakdown } from './MacroBreakdown';
import { Trash2 } from 'lucide-react';

interface FoodCardProps {
  entry: FoodEntry;
  onDelete?: (id: string) => void;
  onClick?: () => void;
}

const mealColors = {
  breakfast: 'amber' as const,
  lunch: 'blue' as const,
  dinner: 'red' as const,
  snack: 'green' as const,
};

export function FoodCard({ entry, onDelete, onClick }: FoodCardProps) {
  const calories = entry.manualOverride?.calories ?? entry.aiAnalysis?.totalCalories ?? 0;
  const macros = entry.aiAnalysis?.totalMacros;

  return (
    <Card className="cursor-pointer hover:border-zinc-600 transition-colors" onClick={onClick}>
      <div className="flex gap-3">
        <img
          src={entry.thumbnail || entry.photo}
          alt="Meal"
          className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge color={mealColors[entry.mealType]}>
              {entry.mealType}
            </Badge>
            <span className="text-sm font-semibold text-accent">{calories} kcal</span>
          </div>
          {entry.description && (
            <p className="text-sm text-muted truncate">{entry.description}</p>
          )}
          {entry.aiAnalysis?.foodItems && (
            <p className="text-xs text-muted truncate mt-0.5">
              {entry.aiAnalysis.foodItems.map((f) => f.name).join(', ')}
            </p>
          )}
          {macros && (
            <div className="flex gap-3 mt-1.5 text-xs text-muted">
              <span>P: {Math.round(macros.protein)}g</span>
              <span>C: {Math.round(macros.carbs)}g</span>
              <span>F: {Math.round(macros.fat)}g</span>
            </div>
          )}
        </div>
        {onDelete && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(entry.id); }}
            className="p-1.5 text-muted hover:text-red-500 self-start cursor-pointer"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </Card>
  );
}
