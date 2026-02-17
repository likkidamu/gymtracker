'use client';

import { usePathname } from 'next/navigation';
import { BottomNav } from './BottomNav';

export function AuthNav() {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  if (isAuthPage) return null;
  return <BottomNav />;
}
