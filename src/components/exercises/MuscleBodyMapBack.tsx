'use client';

import { MuscleGroupId } from '@/types/exercise';

interface MuscleBodyMapBackProps {
  primaryMuscles: MuscleGroupId[];
  secondaryMuscles: MuscleGroupId[];
}

function getFill(muscle: MuscleGroupId, primary: MuscleGroupId[], secondary: MuscleGroupId[]) {
  if (primary.includes(muscle)) return '#84cc16';
  if (secondary.includes(muscle)) return '#84cc16';
  return '#27272a';
}

function getOpacity(muscle: MuscleGroupId, primary: MuscleGroupId[], secondary: MuscleGroupId[]) {
  if (primary.includes(muscle)) return 1;
  if (secondary.includes(muscle)) return 0.4;
  return 1;
}

function getClass(muscle: MuscleGroupId, primary: MuscleGroupId[]) {
  return primary.includes(muscle) ? 'muscle-pulse' : '';
}

export function MuscleBodyMapBack({ primaryMuscles, secondaryMuscles }: MuscleBodyMapBackProps) {
  const p = primaryMuscles;
  const s = secondaryMuscles;

  return (
    <svg viewBox="0 0 160 340" className="w-full h-auto">
      {/* Body outline */}
      <g stroke="#3f3f46" strokeWidth="1.5" fill="none">
        {/* Head */}
        <ellipse cx="80" cy="28" rx="16" ry="20" />
        {/* Neck */}
        <rect x="73" y="48" width="14" height="10" rx="3" />
        {/* Torso */}
        <path d="M55 58 Q55 55 50 60 L40 70 L38 100 L42 140 L50 165 L55 170 L65 175 L80 178 L95 175 L105 170 L110 165 L118 140 L122 100 L120 70 L110 60 Q105 55 105 58 Z" />
        {/* Left arm */}
        <path d="M40 70 L30 75 L22 100 L20 130 L22 155 L26 170 L30 172 L34 170 L32 155 L30 130 L32 100 L38 80" />
        {/* Right arm */}
        <path d="M120 70 L130 75 L138 100 L140 130 L138 155 L134 170 L130 172 L126 170 L128 155 L130 130 L128 100 L122 80" />
        {/* Left leg */}
        <path d="M58 175 L52 210 L50 250 L49 280 L48 310 L46 330 L54 332 L56 330 L55 310 L56 280 L58 250 L60 210 L65 178" />
        {/* Right leg */}
        <path d="M102 175 L108 210 L110 250 L111 280 L112 310 L114 330 L106 332 L104 330 L105 310 L104 280 L102 250 L100 210 L95 178" />
      </g>

      {/* Traps */}
      <path
        d="M62 55 L78 50 L80 58 L82 50 L98 55 L98 75 L80 80 L62 75 Z"
        fill={getFill('traps', p, s)}
        opacity={getOpacity('traps', p, s)}
        className={getClass('traps', p)}
      />

      {/* Rear Delts - left */}
      <path
        d="M36 68 L50 62 L50 80 L38 82 Z"
        fill={getFill('rear_delts', p, s)}
        opacity={getOpacity('rear_delts', p, s)}
        className={getClass('rear_delts', p)}
      />
      {/* Rear Delts - right */}
      <path
        d="M110 62 L124 68 L122 82 L110 80 Z"
        fill={getFill('rear_delts', p, s)}
        opacity={getOpacity('rear_delts', p, s)}
        className={getClass('rear_delts', p)}
      />

      {/* Lats - left */}
      <path
        d="M55 78 L68 82 L65 130 L50 125 L48 100 Z"
        fill={getFill('lats', p, s)}
        opacity={getOpacity('lats', p, s)}
        className={getClass('lats', p)}
      />
      {/* Lats - right */}
      <path
        d="M92 82 L105 78 L112 100 L110 125 L95 130 Z"
        fill={getFill('lats', p, s)}
        opacity={getOpacity('lats', p, s)}
        className={getClass('lats', p)}
      />

      {/* Lower Back */}
      <path
        d="M65 130 L95 130 L98 160 L80 165 L62 160 Z"
        fill={getFill('lower_back', p, s)}
        opacity={getOpacity('lower_back', p, s)}
        className={getClass('lower_back', p)}
      />

      {/* Triceps - left */}
      <path
        d="M32 86 L40 84 L40 122 L32 120 Z"
        fill={getFill('triceps', p, s)}
        opacity={getOpacity('triceps', p, s)}
        className={getClass('triceps', p)}
      />
      {/* Triceps - right */}
      <path
        d="M120 84 L128 86 L128 120 L120 122 Z"
        fill={getFill('triceps', p, s)}
        opacity={getOpacity('triceps', p, s)}
        className={getClass('triceps', p)}
      />

      {/* Glutes - left */}
      <path
        d="M55 162 L78 165 L78 190 L55 188 Z"
        fill={getFill('glutes', p, s)}
        opacity={getOpacity('glutes', p, s)}
        className={getClass('glutes', p)}
      />
      {/* Glutes - right */}
      <path
        d="M82 165 L105 162 L105 188 L82 190 Z"
        fill={getFill('glutes', p, s)}
        opacity={getOpacity('glutes', p, s)}
        className={getClass('glutes', p)}
      />

      {/* Hamstrings - left */}
      <path
        d="M54 195 L68 192 L66 258 L52 258 Z"
        fill={getFill('hamstrings', p, s)}
        opacity={getOpacity('hamstrings', p, s)}
        className={getClass('hamstrings', p)}
      />
      {/* Hamstrings - right */}
      <path
        d="M92 192 L106 195 L108 258 L94 258 Z"
        fill={getFill('hamstrings', p, s)}
        opacity={getOpacity('hamstrings', p, s)}
        className={getClass('hamstrings', p)}
      />

      {/* Calves - back left */}
      <path
        d="M50 268 L60 265 L58 310 L50 312 Z"
        fill={getFill('calves', p, s)}
        opacity={getOpacity('calves', p, s)}
        className={getClass('calves', p)}
      />
      {/* Calves - back right */}
      <path
        d="M100 265 L110 268 L110 312 L102 310 Z"
        fill={getFill('calves', p, s)}
        opacity={getOpacity('calves', p, s)}
        className={getClass('calves', p)}
      />

      {/* Labels */}
      <text x="80" y="348" textAnchor="middle" className="fill-muted text-[10px]">
        Back
      </text>
    </svg>
  );
}
