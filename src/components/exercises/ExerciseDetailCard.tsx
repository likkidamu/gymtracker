import { ExerciseInfo } from '@/types/exercise';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { categoryLabels } from '@/data/exerciseDatabase';
import { getMuscleLabel } from '@/data/muscleGroups';

interface ExerciseDetailCardProps {
  exercise: ExerciseInfo;
}

export function ExerciseDetailCard({ exercise }: ExerciseDetailCardProps) {
  return (
    <Card className="space-y-3">
      <div>
        <h2 className="text-lg font-bold">{exercise.name}</h2>
        <p className="text-sm text-muted mt-0.5">{exercise.description}</p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Badge color="blue">{categoryLabels[exercise.category]}</Badge>
        <Badge color="amber">MET {exercise.met}</Badge>
        <Badge color="zinc">{exercise.defaultRepsPerSet} reps</Badge>
      </div>

      {exercise.primaryMuscles.length > 0 && (
        <div>
          <p className="text-xs text-muted mb-1.5">Primary Muscles</p>
          <div className="flex flex-wrap gap-1.5">
            {exercise.primaryMuscles.map((m) => (
              <Badge key={m} color="lime">{getMuscleLabel(m)}</Badge>
            ))}
          </div>
        </div>
      )}

      {exercise.secondaryMuscles.length > 0 && (
        <div>
          <p className="text-xs text-muted mb-1.5">Secondary Muscles</p>
          <div className="flex flex-wrap gap-1.5">
            {exercise.secondaryMuscles.map((m) => (
              <Badge key={m} color="zinc">{getMuscleLabel(m)}</Badge>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
