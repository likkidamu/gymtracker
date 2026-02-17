import { Exercise } from '@/types/training';
import { Badge } from '@/components/ui/Badge';

interface ExerciseItemProps {
  exercise: Exercise;
  index: number;
}

export function ExerciseItem({ exercise, index }: ExerciseItemProps) {
  return (
    <div className="flex items-start gap-3 py-2">
      <span className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center text-xs text-muted flex-shrink-0 mt-0.5">
        {index + 1}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{exercise.name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-accent">{exercise.sets} × {exercise.reps}</span>
          <span className="text-xs text-muted">Rest: {exercise.restSeconds}s</span>
          {exercise.muscleGroup && <Badge color="zinc">{exercise.muscleGroup}</Badge>}
        </div>
        {exercise.notes && <p className="text-xs text-muted mt-0.5">{exercise.notes}</p>}
      </div>
    </div>
  );
}
