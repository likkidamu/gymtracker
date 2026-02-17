'use client';

import { useState } from 'react';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { MacroBreakdown } from './MacroBreakdown';
import { useImageUpload } from '@/hooks/useImageUpload';
import { MealType, FoodAIAnalysis } from '@/types/food';
import { MEAL_TYPES } from '@/lib/utils/constants';
import { Sparkles, Save } from 'lucide-react';

interface FoodAnalysisFormProps {
  onSave: (data: {
    photo: string;
    thumbnail: string;
    mealType: MealType;
    description?: string;
    aiAnalysis?: FoodAIAnalysis;
  }) => Promise<void>;
  onCancel: () => void;
}

export function FoodAnalysisForm({ onSave, onCancel }: FoodAnalysisFormProps) {
  const { image, thumbnail, isProcessing, error, handleFileSelect, reset } = useImageUpload();
  const [mealType, setMealType] = useState<MealType>('lunch');
  const [description, setDescription] = useState('');
  const [analysis, setAnalysis] = useState<FoodAIAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleAnalyze = async () => {
    if (!image) return;
    setAnalyzing(true);
    setAnalyzeError(null);
    try {
      const res = await fetch('/api/ai/analyze-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image, mealType }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Analysis failed');
      }
      const data = await res.json();
      setAnalysis(data);
    } catch (err) {
      setAnalyzeError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSave = async () => {
    if (!image || !thumbnail) return;
    setSaving(true);
    try {
      await onSave({
        photo: image,
        thumbnail,
        mealType,
        description: description || undefined,
        aiAnalysis: analysis || undefined,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <ImageUpload
        image={image}
        isProcessing={isProcessing}
        onFileSelect={handleFileSelect}
        onClear={reset}
        error={error}
      />

      <Select
        label="Meal Type"
        options={MEAL_TYPES as unknown as { value: string; label: string }[]}
        value={mealType}
        onChange={(e) => setMealType(e.target.value as MealType)}
      />

      <Input
        label="Description (optional)"
        placeholder="e.g. Chicken salad with dressing"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {image && !analysis && (
        <Button onClick={handleAnalyze} disabled={analyzing} className="w-full">
          {analyzing ? (
            <LoadingSpinner size={18} />
          ) : (
            <>
              <Sparkles size={16} />
              Analyze with AI
            </>
          )}
        </Button>
      )}

      {analyzeError && (
        <p className="text-sm text-red-500 text-center">{analyzeError}</p>
      )}

      {analysis && (
        <div className="space-y-3">
          <div className="bg-zinc-800 rounded-xl p-3">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium">AI Analysis</span>
              <span className="text-lg font-bold text-accent">{analysis.totalCalories} kcal</span>
            </div>
            <MacroBreakdown macros={analysis.totalMacros} />
            {analysis.foodItems.length > 0 && (
              <div className="mt-3 pt-3 border-t border-zinc-700 space-y-1">
                {analysis.foodItems.map((item, i) => (
                  <div key={i} className="flex justify-between text-xs text-muted">
                    <span>{item.name} ({item.portion})</span>
                    <span>{item.calories} kcal</span>
                  </div>
                ))}
              </div>
            )}
            {analysis.healthNotes && (
              <p className="mt-3 pt-3 border-t border-zinc-700 text-xs text-muted">{analysis.healthNotes}</p>
            )}
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button variant="secondary" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!image || saving} className="flex-1">
          {saving ? <LoadingSpinner size={18} /> : <><Save size={16} /> Save</>}
        </Button>
      </div>
    </div>
  );
}
