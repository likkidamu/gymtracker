'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { MacroBreakdown } from '@/components/food/MacroBreakdown';
import { FoodEntry } from '@/types/food';
import { foodStorage } from '@/lib/storage';
import { formatDate } from '@/lib/utils/dates';

export default function FoodDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [entry, setEntry] = useState<FoodEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    foodStorage.getById(id).then((data) => {
      setEntry(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="flex items-center justify-center h-[60vh]"><LoadingSpinner /></div>;
  if (!entry) return <div className="p-4 text-center text-muted">Entry not found</div>;

  const calories = entry.manualOverride?.calories ?? entry.aiAnalysis?.totalCalories ?? 0;

  return (
    <>
      <Header title="Meal Details" showBack />
      <div className="px-4 py-4 space-y-4">
        <img src={entry.photo} alt="Meal" className="w-full rounded-2xl object-cover max-h-72" />

        <div className="flex items-center gap-2">
          <Badge color="amber">{entry.mealType}</Badge>
          <span className="text-sm text-muted">{formatDate(entry.date)}</span>
        </div>

        <div className="text-3xl font-bold text-accent">{calories} <span className="text-lg font-normal text-muted">kcal</span></div>

        {entry.description && <p className="text-sm text-muted">{entry.description}</p>}

        {entry.aiAnalysis?.totalMacros && (
          <Card>
            <p className="text-sm font-medium mb-3">Macros</p>
            <MacroBreakdown macros={entry.aiAnalysis.totalMacros} />
          </Card>
        )}

        {entry.aiAnalysis?.foodItems && entry.aiAnalysis.foodItems.length > 0 && (
          <Card>
            <p className="text-sm font-medium mb-3">Food Items</p>
            <div className="space-y-2">
              {entry.aiAnalysis.foodItems.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-muted">{item.portion}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-accent">{item.calories} kcal</p>
                    <p className="text-xs text-muted">P:{Math.round(item.macros.protein)}g C:{Math.round(item.macros.carbs)}g F:{Math.round(item.macros.fat)}g</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {entry.aiAnalysis?.healthNotes && (
          <Card>
            <p className="text-sm font-medium mb-1">Health Notes</p>
            <p className="text-sm text-muted">{entry.aiAnalysis.healthNotes}</p>
            {entry.aiAnalysis.mealRating && (
              <div className="mt-2 flex items-center gap-1">
                <span className="text-xs text-muted">Rating:</span>
                <span className="text-sm font-semibold text-accent">{entry.aiAnalysis.mealRating}/10</span>
              </div>
            )}
          </Card>
        )}
      </div>
    </>
  );
}
