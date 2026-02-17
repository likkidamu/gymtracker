'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { TrainingPlanCard } from '@/components/training/TrainingPlanCard';
import { PlanGenerator } from '@/components/training/PlanGenerator';
import { useTraining } from '@/hooks/useTraining';
import { Plus, Dumbbell } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TrainingPage() {
  const { plans, loading, addPlan, deletePlan, setActivePlan, generatePlan } = useTraining();
  const [showGenerator, setShowGenerator] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const router = useRouter();

  const handleGenerate = async (params: Parameters<typeof generatePlan>[0]) => {
    setIsGenerating(true);
    setGenError(null);
    try {
      const result = await generatePlan(params);
      await addPlan({
        name: result.name,
        goal: params.goal,
        fitnessLevel: params.level,
        daysPerWeek: params.days,
        equipment: params.equipment,
        duration: result.duration,
        workoutDays: result.workoutDays,
      });
      setShowGenerator(false);
    } catch (err) {
      setGenError(err instanceof Error ? err.message : 'Failed to generate plan');
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <LoadingSpinner text="Loading plans..." />
      </div>
    );
  }

  return (
    <>
      <Header
        title="Training"
        action={
          <Button size="sm" onClick={() => setShowGenerator(true)}>
            <Plus size={16} /> Generate
          </Button>
        }
      />

      <div className="px-4 py-4 space-y-3">
        {plans.length > 0 ? (
          plans.map((plan) => (
            <TrainingPlanCard
              key={plan.id}
              plan={plan}
              onActivate={setActivePlan}
              onDelete={deletePlan}
              onClick={() => router.push(`/training/${plan.id}`)}
            />
          ))
        ) : (
          <EmptyState
            icon={Dumbbell}
            title="No training plans"
            description="Let AI generate a personalized workout plan based on your goals and equipment"
            action={<Button onClick={() => setShowGenerator(true)}><Plus size={16} /> Generate a plan</Button>}
          />
        )}
      </div>

      <Modal isOpen={showGenerator} onClose={() => !isGenerating && setShowGenerator(false)} title="Generate Workout Plan">
        <PlanGenerator
          onGenerate={handleGenerate}
          onCancel={() => setShowGenerator(false)}
          isGenerating={isGenerating}
        />
        {genError && <p className="text-sm text-red-500 text-center mt-3">{genError}</p>}
      </Modal>
    </>
  );
}
