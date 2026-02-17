interface BadgeProps {
  children: React.ReactNode;
  color?: 'lime' | 'blue' | 'amber' | 'red' | 'green' | 'zinc';
  className?: string;
}

const colors = {
  lime: 'bg-lime-500/10 text-lime-500',
  blue: 'bg-blue-500/10 text-blue-500',
  amber: 'bg-amber-500/10 text-amber-500',
  red: 'bg-red-500/10 text-red-500',
  green: 'bg-green-500/10 text-green-500',
  zinc: 'bg-zinc-700 text-zinc-300',
};

export function Badge({ children, color = 'lime', className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color]} ${className}`}>
      {children}
    </span>
  );
}
