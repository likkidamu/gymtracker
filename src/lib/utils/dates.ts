import { format, isToday, isYesterday, parseISO } from 'date-fns';

export function formatDate(dateStr: string): string {
  const date = parseISO(dateStr);
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'MMM d, yyyy');
}

export function formatShortDate(dateStr: string): string {
  return format(parseISO(dateStr), 'MMM d');
}

export function getTodayISO(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function getDateISO(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}
