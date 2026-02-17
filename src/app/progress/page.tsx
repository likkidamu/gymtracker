'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProgressCard } from '@/components/progress/ProgressCard';
import { ProgressForm } from '@/components/progress/ProgressForm';
import { BodyMetricsChart } from '@/components/progress/BodyMetricsChart';
import { useProgress } from '@/hooks/useProgress';
import { Plus, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProgressPage() {
  const { entries, loading, addEntry, deleteEntry, getLatest } = useProgress();
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();

  const latestEntry = getLatest();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <LoadingSpinner text="Loading progress..." />
      </div>
    );
  }

  return (
    <>
      <Header
        title="Progress"
        action={
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus size={16} /> Add
          </Button>
        }
      />

      <div className="px-4 py-4 space-y-4">
        <BodyMetricsChart entries={entries} />

        {entries.length > 0 ? (
          <div className="space-y-2">
            {entries.map((entry) => (
              <ProgressCard
                key={entry.id}
                entry={entry}
                onDelete={deleteEntry}
                onClick={() => router.push(`/progress/${entry.id}`)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={TrendingUp}
            title="No progress photos"
            description="Upload body photos and track your weight to see your transformation over time"
            action={<Button onClick={() => setShowForm(true)}><Plus size={16} /> Add first entry</Button>}
          />
        )}
      </div>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Log Progress">
        <ProgressForm
          previousImage={latestEntry?.photo}
          onSave={async (data) => {
            await addEntry(data);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      </Modal>
    </>
  );
}
