export function CodeSkeleton() {
  return (
    <div className="group relative rounded-lg overflow-hidden border border-emerald-200/20">
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/50 border-b border-emerald-200/20">
        <div className="flex items-center gap-2">
          <div className="h-4 w-16 bg-zinc-700/50 rounded animate-pulse" />
        </div>
      </div>
      <div className="p-4 space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-2">
            <div className="h-4 w-8 bg-zinc-700/50 rounded animate-pulse" />
            <div className="h-4 flex-1 bg-zinc-700/50 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
