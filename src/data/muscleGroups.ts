import { MuscleGroupId } from '@/types/exercise';

export interface MuscleGroupMeta {
  id: MuscleGroupId;
  label: string;
  view: 'front' | 'back' | 'both';
}

export const muscleGroups: MuscleGroupMeta[] = [
  { id: 'chest', label: 'Chest', view: 'front' },
  { id: 'front_delts', label: 'Front Delts', view: 'front' },
  { id: 'side_delts', label: 'Side Delts', view: 'front' },
  { id: 'rear_delts', label: 'Rear Delts', view: 'back' },
  { id: 'biceps', label: 'Biceps', view: 'front' },
  { id: 'triceps', label: 'Triceps', view: 'back' },
  { id: 'forearms', label: 'Forearms', view: 'front' },
  { id: 'abs', label: 'Abs', view: 'front' },
  { id: 'obliques', label: 'Obliques', view: 'front' },
  { id: 'quads', label: 'Quads', view: 'front' },
  { id: 'hamstrings', label: 'Hamstrings', view: 'back' },
  { id: 'glutes', label: 'Glutes', view: 'back' },
  { id: 'calves', label: 'Calves', view: 'both' },
  { id: 'traps', label: 'Traps', view: 'back' },
  { id: 'lats', label: 'Lats', view: 'back' },
  { id: 'lower_back', label: 'Lower Back', view: 'back' },
];

export function getMuscleLabel(id: MuscleGroupId): string {
  return muscleGroups.find((m) => m.id === id)?.label || id;
}
