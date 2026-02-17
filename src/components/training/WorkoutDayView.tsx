'use client';

import { useState } from 'react';
import { WorkoutDay } from '@/types/training';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ExerciseItem } from './ExerciseItem';
import { ChevronDown, ChevronUp, Clock } from 'lucide-react';

interface WorkoutDayViewProps {
  day: WorkoutDay;
}

export function WorkoutDayView({ day }: WorkoutDayViewProps) {
  const [expanded, setExpanded] = useState(false);

  if (day.restDay) {
    return (
      <Card className="opacity-60">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Day {day.dayNumber}: {day.name}</p>
            <p className="text-xs text-muted">Rest & Recovery</p>
          </div>
          <Badge color="green">Rest Day</Badge>
        </div>
      </Card>
    );
  }

  return (
    <Card padding={false}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 cursor-pointer"
      >
        <div className="text-left">
          <p className="text-sm font-medium">Day {day.dayNumber}: {day.name}</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1 text-xs text-muted">
              <Clock size={12} />
              {day.estimatedDuration} min
            </div>
            <span className="text-xs text-muted">•</span>
            <span className="text-xs text-muted">{day.exercises.length} exercises</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-1.5">
            {day.focusMuscleGroups.map((g) => (
              <Badge key={g} color="lime">{g}</Badge>
            ))}
          </div>
        </div>
        {expanded ? <ChevronUp size={18} className="text-muted" /> : <ChevronDown size={18} className="text-muted" />}
      </button>
      {expanded && (
        <div className="px-4 pb-4 border-t border-card-border">
          <div className="divide-y divide-zinc-800">
            {day.exercises.map((ex, i) => (
              <ExerciseItem key={i} exercise={ex} index={i} />
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
