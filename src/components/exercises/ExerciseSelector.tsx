'use client';

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { ExerciseInfo, ExerciseCategory } from '@/types/exercise';
import { exerciseDatabase, categoryLabels } from '@/data/exerciseDatabase';

interface ExerciseSelectorProps {
  selectedId: string | null;
  onSelect: (exercise: ExerciseInfo) => void;
  planExercises?: ExerciseInfo[];
}

const categoryOrder: ExerciseCategory[] = [
  'chest', 'back', 'shoulders', 'arms', 'legs', 'core', 'full_body',
];

export function ExerciseSelector({ selectedId, onSelect, planExercises = [] }: ExerciseSelectorProps) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return exerciseDatabase;
    const q = search.toLowerCase();
    return exerciseDatabase.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q)
    );
  }, [search]);

  const grouped = useMemo(() => {
    const map = new Map<ExerciseCategory, ExerciseInfo[]>();
    for (const cat of categoryOrder) {
      const items = filtered.filter((e) => e.category === cat);
      if (items.length > 0) map.set(cat, items);
    }
    return map;
  }, [filtered]);

  const filteredPlanExercises = useMemo(() => {
    if (!search.trim()) return planExercises;
    const q = search.toLowerCase();
    return planExercises.filter((e) => e.name.toLowerCase().includes(q));
  }, [search, planExercises]);

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="text"
          placeholder="Search exercises..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-zinc-800 border border-card-border rounded-xl pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
        />
      </div>

      <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-1">
        {filteredPlanExercises.length > 0 && (
          <div>
            <p className="text-xs font-medium text-accent mb-2">From Your Plan</p>
            <div className="space-y-1">
              {filteredPlanExercises.map((ex) => (
                <button
                  key={`plan-${ex.id}`}
                  onClick={() => onSelect(ex)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors cursor-pointer ${
                    selectedId === ex.id
                      ? 'bg-accent/10 text-accent border border-accent/30'
                      : 'bg-zinc-800/50 text-foreground hover:bg-zinc-800'
                  }`}
                >
                  {ex.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {Array.from(grouped.entries()).map(([category, exercises]) => (
          <div key={category}>
            <p className="text-xs font-medium text-muted mb-2">{categoryLabels[category]}</p>
            <div className="space-y-1">
              {exercises.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => onSelect(ex)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors cursor-pointer ${
                    selectedId === ex.id
                      ? 'bg-accent/10 text-accent border border-accent/30'
                      : 'bg-zinc-800/50 text-foreground hover:bg-zinc-800'
                  }`}
                >
                  {ex.name}
                </button>
              ))}
            </div>
          </div>
        ))}

        {filtered.length === 0 && filteredPlanExercises.length === 0 && (
          <p className="text-sm text-muted text-center py-4">No exercises found</p>
        )}
      </div>
    </div>
  );
}
