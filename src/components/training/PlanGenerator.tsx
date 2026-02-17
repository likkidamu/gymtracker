'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { TrainingGoal, FitnessLevel } from '@/types/training';
import { FITNESS_LEVELS, TRAINING_GOALS, EQUIPMENT_OPTIONS } from '@/lib/utils/constants';
import { Sparkles } from 'lucide-react';

interface PlanGeneratorProps {
  onGenerate: (params: {
    goal: TrainingGoal;
    level: FitnessLevel;
    days: number;
    equipment: string[];
    notes?: string;
  }) => Promise<void>;
  onCancel: () => void;
  isGenerating: boolean;
}

export function PlanGenerator({ onGenerate, onCancel, isGenerating }: PlanGeneratorProps) {
  const [goal, setGoal] = useState<TrainingGoal>('muscle_gain');
  const [level, setLevel] = useState<FitnessLevel>('intermediate');
  const [days, setDays] = useState('4');
  const [equipment, setEquipment] = useState<string[]>(['Barbell', 'Dumbbells', 'Bench', 'Cables']);
  const [notes, setNotes] = useState('');

  const toggleEquipment = (item: string) => {
    setEquipment((prev) =>
      prev.includes(item) ? prev.filter((e) => e !== item) : [...prev, item]
    );
  };

  const handleSubmit = () => {
    onGenerate({
      goal,
      level,
      days: parseInt(days),
      equipment,
      notes: notes || undefined,
    });
  };

  return (
    <div className="space-y-4">
      <Select
        label="Training Goal"
        options={TRAINING_GOALS as unknown as { value: string; label: string }[]}
        value={goal}
        onChange={(e) => setGoal(e.target.value as TrainingGoal)}
      />

      <Select
        label="Fitness Level"
        options={FITNESS_LEVELS as unknown as { value: string; label: string }[]}
        value={level}
        onChange={(e) => setLevel(e.target.value as FitnessLevel)}
      />

      <Select
        label="Days per Week"
        options={[3, 4, 5, 6].map((n) => ({ value: String(n), label: `${n} days` }))}
        value={days}
        onChange={(e) => setDays(e.target.value)}
      />

      <div className="space-y-1.5">
        <label className="block text-sm text-muted">Equipment Available</label>
        <div className="flex flex-wrap gap-2">
          {EQUIPMENT_OPTIONS.map((item) => (
            <button
              key={item}
              onClick={() => toggleEquipment(item)}
              className={`px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer
                ${equipment.includes(item)
                  ? 'bg-accent/20 text-accent border border-accent/50'
                  : 'bg-zinc-800 text-muted border border-zinc-700 hover:border-zinc-500'
                }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <Input
        label="Additional Notes (optional)"
        placeholder="e.g. Focus on chest, avoid deadlifts..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <div className="flex gap-3 pt-2">
        <Button variant="secondary" onClick={onCancel} className="flex-1">Cancel</Button>
        <Button onClick={handleSubmit} disabled={isGenerating || equipment.length === 0} className="flex-1">
          {isGenerating ? (
            <LoadingSpinner size={18} />
          ) : (
            <><Sparkles size={16} /> Generate Plan</>
          )}
        </Button>
      </div>
    </div>
  );
}
