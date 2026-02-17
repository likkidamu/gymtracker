'use client';

import { useState, useEffect, useCallback } from 'react';
import { ProgressEntry, ProgressAIAnalysis, ProgressMeasurements } from '@/types/progress';
import { progressStorage } from '@/lib/storage';
import { getTodayISO } from '@/lib/utils/dates';

export function useProgress() {
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const all = await progressStorage.getAll();
    setEntries(all);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addEntry = async (data: {
    photo: string;
    thumbnail: string;
    weight?: number;
    bodyFatPercentage?: number;
    measurements?: ProgressMeasurements;
    aiAnalysis?: ProgressAIAnalysis;
    notes?: string;
  }) => {
    const entry = await progressStorage.create({
      ...data,
      date: getTodayISO(),
    });
    setEntries((prev) => [entry, ...prev]);
    return entry;
  };

  const deleteEntry = async (id: string) => {
    await progressStorage.delete(id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const analyzeProgress = async (image: string, previousImage?: string): Promise<ProgressAIAnalysis> => {
    const res = await fetch('/api/ai/analyze-progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image, previousImage }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Analysis failed');
    }
    return res.json();
  };

  const getLatest = useCallback(() => entries[0] || null, [entries]);

  return {
    entries,
    loading,
    refresh,
    addEntry,
    deleteEntry,
    analyzeProgress,
    getLatest,
  };
}
