'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  action?: React.ReactNode;
}

export function Header({ title, showBack, action }: HeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-card-border">
      <div className="max-w-lg mx-auto flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-3">
          {showBack && (
            <button onClick={() => router.back()} className="p-1 -ml-1 text-muted hover:text-foreground cursor-pointer">
              <ArrowLeft size={20} />
            </button>
          )}
          <h1 className="text-lg font-bold">{title}</h1>
        </div>
        {action && <div>{action}</div>}
      </div>
    </header>
  );
}
