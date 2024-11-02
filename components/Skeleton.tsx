export function Skeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-square rounded-lg bg-black/5 dark:bg-white/5 mb-3" />
      <div className="space-y-2">
        <div className="h-5 bg-black/5 dark:bg-white/5 rounded-lg w-3/4" />
        <div className="h-4 bg-black/5 dark:bg-white/5 rounded-lg w-1/2" />
      </div>
    </div>
  );
} 