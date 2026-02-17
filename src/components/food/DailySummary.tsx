import { Card } from '@/components/ui/Card';

interface DailySummaryProps {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export function DailySummary({ calories, protein, carbs, fat }: DailySummaryProps) {
  return (
    <Card className="bg-gradient-to-br from-zinc-900 to-zinc-800">
      <p className="text-xs text-muted uppercase tracking-wider mb-2">Today&apos;s Totals</p>
      <div className="text-3xl font-bold text-accent mb-3">{Math.round(calories)} <span className="text-lg font-normal text-muted">kcal</span></div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <p className="text-lg font-semibold text-macro-protein">{Math.round(protein)}g</p>
          <p className="text-xs text-muted">Protein</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-macro-carbs">{Math.round(carbs)}g</p>
          <p className="text-xs text-muted">Carbs</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-macro-fat">{Math.round(fat)}g</p>
          <p className="text-xs text-muted">Fat</p>
        </div>
      </div>
    </Card>
  );
}
