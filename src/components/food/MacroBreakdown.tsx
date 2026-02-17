import { MacroNutrients } from '@/types/food';

interface MacroBreakdownProps {
  macros: MacroNutrients;
  size?: 'sm' | 'md';
}

interface MacroBarProps {
  label: string;
  value: number;
  unit: string;
  color: string;
  bgColor: string;
  maxValue: number;
}

function MacroBar({ label, value, unit, color, bgColor, maxValue }: MacroBarProps) {
  const percentage = maxValue > 0 ? Math.min((value / maxValue) * 100, 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className={color}>{label}</span>
        <span className="text-muted">{Math.round(value)}{unit}</span>
      </div>
      <div className={`h-1.5 rounded-full ${bgColor}`}>
        <div className={`h-full rounded-full ${color.replace('text-', 'bg-')}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

export function MacroBreakdown({ macros, size = 'md' }: MacroBreakdownProps) {
  const maxGrams = Math.max(macros.protein, macros.carbs, macros.fat, 1);

  return (
    <div className={`space-y-${size === 'sm' ? '2' : '3'}`}>
      <MacroBar label="Protein" value={macros.protein} unit="g" color="text-macro-protein" bgColor="bg-blue-500/10" maxValue={maxGrams} />
      <MacroBar label="Carbs" value={macros.carbs} unit="g" color="text-macro-carbs" bgColor="bg-amber-500/10" maxValue={maxGrams} />
      <MacroBar label="Fat" value={macros.fat} unit="g" color="text-macro-fat" bgColor="bg-red-500/10" maxValue={maxGrams} />
      <MacroBar label="Fiber" value={macros.fiber} unit="g" color="text-macro-fiber" bgColor="bg-green-500/10" maxValue={maxGrams} />
    </div>
  );
}
