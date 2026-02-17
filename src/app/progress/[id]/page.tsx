'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ProgressEntry } from '@/types/progress';
import { progressStorage } from '@/lib/storage';
import { formatDate } from '@/lib/utils/dates';
import { Weight } from 'lucide-react';

export default function ProgressDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [entry, setEntry] = useState<ProgressEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    progressStorage.getById(id).then((data) => {
      setEntry(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="flex items-center justify-center h-[60vh]"><LoadingSpinner /></div>;
  if (!entry) return <div className="p-4 text-center text-muted">Entry not found</div>;

  return (
    <>
      <Header title="Progress Details" showBack />
      <div className="px-4 py-4 space-y-4">
        <img src={entry.photo} alt="Progress" className="w-full rounded-2xl object-cover max-h-96" />

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted">{formatDate(entry.date)}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {entry.weight && (
            <Badge color="lime"><Weight size={12} className="mr-1" />{entry.weight} kg</Badge>
          )}
          {entry.bodyFatPercentage && <Badge color="blue">{entry.bodyFatPercentage}% BF</Badge>}
        </div>

        {entry.measurements && Object.keys(entry.measurements).length > 0 && (
          <Card>
            <p className="text-sm font-medium mb-3">Measurements (cm)</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {entry.measurements.chest && <div><span className="text-muted">Chest:</span> {entry.measurements.chest}</div>}
              {entry.measurements.waist && <div><span className="text-muted">Waist:</span> {entry.measurements.waist}</div>}
              {entry.measurements.hips && <div><span className="text-muted">Hips:</span> {entry.measurements.hips}</div>}
              {entry.measurements.biceps && <div><span className="text-muted">Biceps:</span> {entry.measurements.biceps}</div>}
              {entry.measurements.thighs && <div><span className="text-muted">Thighs:</span> {entry.measurements.thighs}</div>}
            </div>
          </Card>
        )}

        {entry.notes && (
          <Card>
            <p className="text-sm font-medium mb-1">Notes</p>
            <p className="text-sm text-muted">{entry.notes}</p>
          </Card>
        )}

        {entry.aiAnalysis && (
          <Card>
            <p className="text-sm font-medium mb-3">AI Analysis</p>
            <div className="space-y-3">
              <p className="text-sm text-muted">{entry.aiAnalysis.observations}</p>

              <div>
                <span className="text-xs text-accent">Estimated Body Fat:</span>
                <span className="text-sm text-muted ml-2">{entry.aiAnalysis.estimatedBodyFat}</span>
              </div>

              {entry.aiAnalysis.muscleGroupNotes.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-medium">Muscle Groups</p>
                  {entry.aiAnalysis.muscleGroupNotes.map((n, i) => (
                    <p key={i} className="text-xs"><span className="text-accent">{n.group}:</span> <span className="text-muted">{n.note}</span></p>
                  ))}
                </div>
              )}

              {entry.aiAnalysis.comparisonNotes && (
                <div>
                  <p className="text-xs font-medium mb-1">Comparison</p>
                  <p className="text-xs text-muted">{entry.aiAnalysis.comparisonNotes}</p>
                </div>
              )}

              {entry.aiAnalysis.recommendations.length > 0 && (
                <div className="pt-2 border-t border-zinc-700">
                  <p className="text-xs font-medium mb-1">Recommendations</p>
                  {entry.aiAnalysis.recommendations.map((r, i) => (
                    <p key={i} className="text-xs text-muted">• {r}</p>
                  ))}
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </>
  );
}
