'use client';

import { useState } from 'react';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useImageUpload } from '@/hooks/useImageUpload';
import { ProgressAIAnalysis, ProgressMeasurements } from '@/types/progress';
import { Sparkles, Save } from 'lucide-react';

interface ProgressFormProps {
  onSave: (data: {
    photo: string;
    thumbnail: string;
    weight?: number;
    bodyFatPercentage?: number;
    measurements?: ProgressMeasurements;
    aiAnalysis?: ProgressAIAnalysis;
    notes?: string;
  }) => Promise<void>;
  onCancel: () => void;
  previousImage?: string;
}

export function ProgressForm({ onSave, onCancel, previousImage }: ProgressFormProps) {
  const { image, thumbnail, isProcessing, error, handleFileSelect, reset } = useImageUpload();
  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [notes, setNotes] = useState('');
  const [chest, setChest] = useState('');
  const [waist, setWaist] = useState('');
  const [hips, setHips] = useState('');
  const [biceps, setBiceps] = useState('');
  const [thighs, setThighs] = useState('');
  const [analysis, setAnalysis] = useState<ProgressAIAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleAnalyze = async () => {
    if (!image) return;
    setAnalyzing(true);
    setAnalyzeError(null);
    try {
      const res = await fetch('/api/ai/analyze-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image, previousImage }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Analysis failed');
      }
      setAnalysis(await res.json());
    } catch (err) {
      setAnalyzeError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSave = async () => {
    if (!image || !thumbnail) return;
    setSaving(true);
    const measurements: ProgressMeasurements = {};
    if (chest) measurements.chest = parseFloat(chest);
    if (waist) measurements.waist = parseFloat(waist);
    if (hips) measurements.hips = parseFloat(hips);
    if (biceps) measurements.biceps = parseFloat(biceps);
    if (thighs) measurements.thighs = parseFloat(thighs);

    try {
      await onSave({
        photo: image,
        thumbnail,
        weight: weight ? parseFloat(weight) : undefined,
        bodyFatPercentage: bodyFat ? parseFloat(bodyFat) : undefined,
        measurements: Object.keys(measurements).length ? measurements : undefined,
        aiAnalysis: analysis || undefined,
        notes: notes || undefined,
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

      <div className="grid grid-cols-2 gap-3">
        <Input label="Weight (kg)" type="number" step="0.1" placeholder="75.0" value={weight} onChange={(e) => setWeight(e.target.value)} />
        <Input label="Body Fat (%)" type="number" step="0.1" placeholder="15.0" value={bodyFat} onChange={(e) => setBodyFat(e.target.value)} />
      </div>

      <details className="group">
        <summary className="text-sm text-muted cursor-pointer hover:text-foreground">
          Body Measurements (cm)
        </summary>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <Input label="Chest" type="number" step="0.1" value={chest} onChange={(e) => setChest(e.target.value)} />
          <Input label="Waist" type="number" step="0.1" value={waist} onChange={(e) => setWaist(e.target.value)} />
          <Input label="Hips" type="number" step="0.1" value={hips} onChange={(e) => setHips(e.target.value)} />
          <Input label="Biceps" type="number" step="0.1" value={biceps} onChange={(e) => setBiceps(e.target.value)} />
          <Input label="Thighs" type="number" step="0.1" value={thighs} onChange={(e) => setThighs(e.target.value)} />
        </div>
      </details>

      <Input label="Notes" placeholder="How you feel today..." value={notes} onChange={(e) => setNotes(e.target.value)} />

      {image && !analysis && (
        <Button onClick={handleAnalyze} disabled={analyzing} className="w-full">
          {analyzing ? (
            <LoadingSpinner size={18} />
          ) : (
            <><Sparkles size={16} /> Analyze with AI</>
          )}
        </Button>
      )}

      {analyzeError && <p className="text-sm text-red-500 text-center">{analyzeError}</p>}

      {analysis && (
        <div className="bg-zinc-800 rounded-xl p-3 space-y-2">
          <p className="text-sm font-medium">AI Analysis</p>
          <p className="text-xs text-muted">{analysis.observations}</p>
          <p className="text-xs"><span className="text-accent">Est. Body Fat:</span> <span className="text-muted">{analysis.estimatedBodyFat}</span></p>
          {analysis.muscleGroupNotes.map((n, i) => (
            <p key={i} className="text-xs"><span className="text-accent">{n.group}:</span> <span className="text-muted">{n.note}</span></p>
          ))}
          {analysis.recommendations.length > 0 && (
            <div className="pt-2 border-t border-zinc-700">
              <p className="text-xs font-medium mb-1">Recommendations</p>
              {analysis.recommendations.map((r, i) => (
                <p key={i} className="text-xs text-muted">• {r}</p>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button variant="secondary" onClick={onCancel} className="flex-1">Cancel</Button>
        <Button onClick={handleSave} disabled={!image || saving} className="flex-1">
          {saving ? <LoadingSpinner size={18} /> : <><Save size={16} /> Save</>}
        </Button>
      </div>
    </div>
  );
}
