'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { DailySummary } from '@/components/food/DailySummary';
import { FoodCard } from '@/components/food/FoodCard';
import { FoodAnalysisForm } from '@/components/food/FoodAnalysisForm';
import { useFood } from '@/hooks/useFood';
import { Plus, Utensils } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function FoodPage() {
  const { entries, loading, addEntry, deleteEntry, getTodayEntries, getTodayTotals } = useFood();
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();

  const todayTotals = getTodayTotals();
  const todayEntries = getTodayEntries();
  const olderEntries = entries.filter((e) => !todayEntries.includes(e));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <LoadingSpinner text="Loading meals..." />
      </div>
    );
  }

  return (
    <>
      <Header
        title="Food Log"
        action={
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus size={16} /> Add
          </Button>
        }
      />

      <div className="px-4 py-4 space-y-4">
        <DailySummary
          calories={todayTotals.calories}
          protein={todayTotals.protein}
          carbs={todayTotals.carbs}
          fat={todayTotals.fat}
        />

        {todayEntries.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-muted uppercase tracking-wider">Today</p>
            {todayEntries.map((entry) => (
              <FoodCard
                key={entry.id}
                entry={entry}
                onDelete={deleteEntry}
                onClick={() => router.push(`/food/${entry.id}`)}
              />
            ))}
          </div>
        )}

        {olderEntries.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-muted uppercase tracking-wider">Earlier</p>
            {olderEntries.map((entry) => (
              <FoodCard
                key={entry.id}
                entry={entry}
                onDelete={deleteEntry}
                onClick={() => router.push(`/food/${entry.id}`)}
              />
            ))}
          </div>
        )}

        {entries.length === 0 && (
          <EmptyState
            icon={Utensils}
            title="No meals logged"
            description="Take a photo of your meal and AI will analyze the calories and macros"
            action={<Button onClick={() => setShowForm(true)}><Plus size={16} /> Log your first meal</Button>}
          />
        )}
      </div>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Log Meal">
        <FoodAnalysisForm
          onSave={async (data) => {
            await addEntry(data);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      </Modal>
    </>
  );
}
