'use client';

import { useState, useEffect, useCallback } from 'react';
import { WorkoutLog } from '@/types/workoutLog';
import { workoutLogStorage } from '@/lib/storage';
import { format, subDays } from 'date-fns';

export function useWorkoutLog() {
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const all = await workoutLogStorage.getAll();
    setLogs(all);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addLog = async (data: Omit<WorkoutLog, 'id' | 'createdAt' | 'updatedAt'>) => {
    const log = await workoutLogStorage.create(data);
    setLogs((prev) => [log, ...prev]);
    return log;
  };

  const deleteLog = async (id: string) => {
    await workoutLogStorage.delete(id);
    setLogs((prev) => prev.filter((l) => l.id !== id));
  };

  const getTodayCaloriesBurned = useCallback(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return logs
      .filter((l) => l.date === today)
      .reduce((sum, l) => sum + l.totalCalories, 0);
  }, [logs]);

  const getWeeklyWorkoutCount = useCallback(() => {
    const today = new Date();
    const weekAgo = format(subDays(today, 6), 'yyyy-MM-dd');
    return logs.filter((l) => l.date >= weekAgo).length;
  }, [logs]);

  const getDailyCaloriesBurned = useCallback((days: number = 7): Record<string, number> => {
    const result: Record<string, number> = {};
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const dateStr = format(subDays(today, i), 'yyyy-MM-dd');
      result[dateStr] = 0;
    }
    for (const log of logs) {
      if (log.date in result) {
        result[log.date] += log.totalCalories;
      }
    }
    return result;
  }, [logs]);

  return {
    logs,
    loading,
    refresh,
    addLog,
    deleteLog,
    getTodayCaloriesBurned,
    getWeeklyWorkoutCount,
    getDailyCaloriesBurned,
  };
}
