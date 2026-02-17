'use client';

import { ProgressEntry } from '@/types/progress';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils/dates';
import { Trash2, Weight } from 'lucide-react';

interface ProgressCardProps {
  entry: ProgressEntry;
  onDelete?: (id: string) => void;
  onClick?: () => void;
}

export function ProgressCard({ entry, onDelete, onClick }: ProgressCardProps) {
  return (
    <Card className="cursor-pointer hover:border-zinc-600 transition-colors" onClick={onClick}>
      <div className="flex gap-3">
        <img
          src={entry.thumbnail || entry.photo}
          alt="Progress"
          className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium mb-1">{formatDate(entry.date)}</p>
          <div className="flex flex-wrap gap-2 mb-1.5">
            {entry.weight && (
              <Badge color="lime">
                <Weight size={12} className="mr-1" />{entry.weight} kg
              </Badge>
            )}
            {entry.bodyFatPercentage && (
              <Badge color="blue">{entry.bodyFatPercentage}% BF</Badge>
            )}
          </div>
          {entry.aiAnalysis?.estimatedBodyFat && (
            <p className="text-xs text-muted">AI est: {entry.aiAnalysis.estimatedBodyFat}</p>
          )}
          {entry.notes && (
            <p className="text-xs text-muted truncate mt-0.5">{entry.notes}</p>
          )}
        </div>
        {onDelete && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(entry.id); }}
            className="p-1.5 text-muted hover:text-red-500 self-start cursor-pointer"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </Card>
  );
}
