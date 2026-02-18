'use client';

import { MuscleGroupId } from '@/types/exercise';
import { MuscleBodyMapFront } from './MuscleBodyMapFront';
import { MuscleBodyMapBack } from './MuscleBodyMapBack';

interface MuscleBodyMapProps {
  primaryMuscles: MuscleGroupId[];
  secondaryMuscles: MuscleGroupId[];
}

export function MuscleBodyMap({ primaryMuscles, secondaryMuscles }: MuscleBodyMapProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <MuscleBodyMapFront primaryMuscles={primaryMuscles} secondaryMuscles={secondaryMuscles} />
      <MuscleBodyMapBack primaryMuscles={primaryMuscles} secondaryMuscles={secondaryMuscles} />
    </div>
  );
}
