'use client';

import { Header } from '@/components/layout/Header';
import { ExerciseExplorer } from '@/components/exercises/ExerciseExplorer';

export default function ExercisesPage() {
  return (
    <>
      <Header title="Exercise Explorer" showBack />
      <div className="px-4 py-4 pb-24">
        <ExerciseExplorer />
      </div>
    </>
  );
}
