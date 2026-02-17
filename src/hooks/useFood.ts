'use client';

import { useState, useEffect, useCallback } from 'react';
import { FoodEntry, FoodAIAnalysis, MealType } from '@/types/food';
import { foodStorage } from '@/lib/storage';
import { getTodayISO } from '@/lib/utils/dates';
import { uploadPhotoWithThumbnail } from '@/lib/supabase/storage';

export function useFood() {
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const all = await foodStorage.getAll();
    setEntries(all);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addEntry = async (data: {
    photo: string;
    thumbnail: string;
    mealType: MealType;
    description?: string;
    aiAnalysis?: FoodAIAnalysis;
  }) => {
    // Upload photos to Supabase Storage, save URLs in DB
    const { photoUrl, thumbnailUrl } = await uploadPhotoWithThumbnail(
      data.photo, data.thumbnail, 'food'
    );

    const entry = await foodStorage.create({
      ...data,
      photo: photoUrl,
      thumbnail: thumbnailUrl,
      date: getTodayISO(),
    });
    setEntries((prev) => [entry, ...prev]);
    return entry;
  };

  const deleteEntry = async (id: string) => {
    await foodStorage.delete(id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const getTodayEntries = useCallback(() => {
    const today = getTodayISO();
    return entries.filter((e) => e.date === today);
  }, [entries]);

  const getTodayTotals = useCallback(() => {
    const todayEntries = getTodayEntries();
    return todayEntries.reduce(
      (acc, entry) => {
        const cal = entry.manualOverride?.calories ?? entry.aiAnalysis?.totalCalories ?? 0;
        const macros = entry.aiAnalysis?.totalMacros;
        return {
          calories: acc.calories + cal,
          protein: acc.protein + (entry.manualOverride?.macros?.protein ?? macros?.protein ?? 0),
          carbs: acc.carbs + (entry.manualOverride?.macros?.carbs ?? macros?.carbs ?? 0),
          fat: acc.fat + (entry.manualOverride?.macros?.fat ?? macros?.fat ?? 0),
          fiber: acc.fiber + (entry.manualOverride?.macros?.fiber ?? macros?.fiber ?? 0),
        };
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    );
  }, [getTodayEntries]);

  const analyzeFood = async (image: string, mealType: MealType): Promise<FoodAIAnalysis> => {
    const res = await fetch('/api/ai/analyze-food', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image, mealType }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Analysis failed');
    }
    return res.json();
  };

  return {
    entries,
    loading,
    refresh,
    addEntry,
    deleteEntry,
    getTodayEntries,
    getTodayTotals,
    analyzeFood,
  };
}
