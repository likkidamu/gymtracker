export function MuscleGroupLegend() {
  return (
    <div className="flex items-center gap-4 text-xs text-muted">
      <div className="flex items-center gap-1.5">
        <span className="w-3 h-3 rounded-sm bg-[#84cc16] muscle-pulse" />
        <span>Primary</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-3 h-3 rounded-sm bg-[#84cc16] opacity-40" />
        <span>Secondary</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-3 h-3 rounded-sm bg-[#27272a]" />
        <span>Inactive</span>
      </div>
    </div>
  );
}
