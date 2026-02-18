'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, TrendingUp, Utensils, Dumbbell, BarChart3 } from 'lucide-react';

const tabs = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/progress', label: 'Progress', icon: TrendingUp },
  { href: '/food', label: 'Food', icon: Utensils },
  { href: '/training', label: 'Training', icon: Dumbbell },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-900/95 backdrop-blur-md border-t border-card-border">
      <div className="max-w-lg mx-auto flex">
        {tabs.map(({ href, label, icon: Icon }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors
                ${isActive ? 'text-accent' : 'text-muted hover:text-foreground'}`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className={isActive ? 'font-semibold' : ''}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
