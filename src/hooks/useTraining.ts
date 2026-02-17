'use client';

import { useState, useEffect, useCallback } from 'react';
import { TrainingPlan, TrainingGoal, FitnessLevel } from '@/types/training';
import { trainingStorage } from '@/lib/storage';

export function useTraining() {
  const [plans, setPlans] = useState<TrainingPlan[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const all = await trainingStorage.getAll();
    setPlans(all);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addPlan = async (data: {
    name: string;
    goal: TrainingGoal;
    fitnessLevel: FitnessLevel;
    daysPerWeek: number;
    equipment: string[];
    duration: string;
    workoutDays: TrainingPlan['workoutDays'];
  }) => {
    const plan = await trainingStorage.create({
      ...data,
      isActive: false,
    });
    setPlans((prev) => [plan, ...prev]);
    return plan;
  };

  const deletePlan = async (id: string) => {
    await trainingStorage.delete(id);
    setPlans((prev) => prev.filter((p) => p.id !== id));
  };

  const setActivePlan = async (id: string) => {
    // Deactivate all
    for (const plan of plans) {
      if (plan.isActive) {
        await trainingStorage.update(plan.id, { isActive: false });
      }
    }
    // Activate selected
    await trainingStorage.update(id, { isActive: true });
    await refresh();
  };

  const generatePlan = async (params: {
    goal: TrainingGoal;
    level: FitnessLevel;
    days: number;
    equipment: string[];
    notes?: string;
  }) => {
    const res = await fetch('/api/ai/generate-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Generation failed');
    }
    return res.json();
  };

  const getActivePlan = useCallback(() => plans.find((p) => p.isActive) || null, [plans]);

  return {
    plans,
    loading,
    refresh,
    addPlan,
    deletePlan,
    setActivePlan,
    generatePlan,
    getActivePlan,
  };
}
