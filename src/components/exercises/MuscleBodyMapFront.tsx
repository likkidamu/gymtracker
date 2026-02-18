'use client';

import { MuscleGroupId } from '@/types/exercise';

interface MuscleBodyMapFrontProps {
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

export function MuscleBodyMapFront({ primaryMuscles, secondaryMuscles }: MuscleBodyMapFrontProps) {
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

      {/* Chest - left pec */}
      <path
        d="M58 72 L78 70 L78 100 L60 105 L55 95 Z"
        fill={getFill('chest', p, s)}
        opacity={getOpacity('chest', p, s)}
        className={getClass('chest', p)}
      />
      {/* Chest - right pec */}
      <path
        d="M82 70 L102 72 L105 95 L100 105 L82 100 Z"
        fill={getFill('chest', p, s)}
        opacity={getOpacity('chest', p, s)}
        className={getClass('chest', p)}
      />

      {/* Front Delts - left */}
      <path
        d="M42 65 L55 62 L55 80 L42 82 Z"
        fill={getFill('front_delts', p, s)}
        opacity={getOpacity('front_delts', p, s)}
        className={getClass('front_delts', p)}
      />
      {/* Front Delts - right */}
      <path
        d="M105 62 L118 65 L118 82 L105 80 Z"
        fill={getFill('front_delts', p, s)}
        opacity={getOpacity('front_delts', p, s)}
        className={getClass('front_delts', p)}
      />

      {/* Side Delts - left */}
      <path
        d="M36 68 L42 64 L42 82 L36 84 Z"
        fill={getFill('side_delts', p, s)}
        opacity={getOpacity('side_delts', p, s)}
        className={getClass('side_delts', p)}
      />
      {/* Side Delts - right */}
      <path
        d="M118 64 L124 68 L124 84 L118 82 Z"
        fill={getFill('side_delts', p, s)}
        opacity={getOpacity('side_delts', p, s)}
        className={getClass('side_delts', p)}
      />

      {/* Biceps - left */}
      <path
        d="M32 90 L38 86 L38 120 L32 122 Z"
        fill={getFill('biceps', p, s)}
        opacity={getOpacity('biceps', p, s)}
        className={getClass('biceps', p)}
      />
      {/* Biceps - right */}
      <path
        d="M122 86 L128 90 L128 122 L122 120 Z"
        fill={getFill('biceps', p, s)}
        opacity={getOpacity('biceps', p, s)}
        className={getClass('biceps', p)}
      />

      {/* Forearms - left */}
      <path
        d="M28 126 L36 122 L34 155 L28 155 Z"
        fill={getFill('forearms', p, s)}
        opacity={getOpacity('forearms', p, s)}
        className={getClass('forearms', p)}
      />
      {/* Forearms - right */}
      <path
        d="M124 122 L132 126 L132 155 L126 155 Z"
        fill={getFill('forearms', p, s)}
        opacity={getOpacity('forearms', p, s)}
        className={getClass('forearms', p)}
      />

      {/* Abs */}
      <path
        d="M70 105 L90 105 L90 160 L70 160 Z"
        fill={getFill('abs', p, s)}
        opacity={getOpacity('abs', p, s)}
        className={getClass('abs', p)}
        rx="3"
      />

      {/* Obliques - left */}
      <path
        d="M55 105 L68 105 L65 160 L50 155 Z"
        fill={getFill('obliques', p, s)}
        opacity={getOpacity('obliques', p, s)}
        className={getClass('obliques', p)}
      />
      {/* Obliques - right */}
      <path
        d="M92 105 L105 105 L110 155 L95 160 Z"
        fill={getFill('obliques', p, s)}
        opacity={getOpacity('obliques', p, s)}
        className={getClass('obliques', p)}
      />

      {/* Quads - left */}
      <path
        d="M54 180 L68 178 L66 245 L52 245 Z"
        fill={getFill('quads', p, s)}
        opacity={getOpacity('quads', p, s)}
        className={getClass('quads', p)}
      />
      {/* Quads - right */}
      <path
        d="M92 178 L106 180 L108 245 L94 245 Z"
        fill={getFill('quads', p, s)}
        opacity={getOpacity('quads', p, s)}
        className={getClass('quads', p)}
      />

      {/* Calves - front left */}
      <path
        d="M50 268 L60 265 L58 310 L50 312 Z"
        fill={getFill('calves', p, s)}
        opacity={getOpacity('calves', p, s)}
        className={getClass('calves', p)}
      />
      {/* Calves - front right */}
      <path
        d="M100 265 L110 268 L110 312 L102 310 Z"
        fill={getFill('calves', p, s)}
        opacity={getOpacity('calves', p, s)}
        className={getClass('calves', p)}
      />

      {/* Labels */}
      <text x="80" y="348" textAnchor="middle" className="fill-muted text-[10px]">
        Front
      </text>
    </svg>
  );
}
