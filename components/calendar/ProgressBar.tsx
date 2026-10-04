"use client";

interface ProgressBarProps {
  completed: number;
  total: number;
}

export function ProgressBar({
  completed,
  total,
}: ProgressBarProps) {
  const progress =
    total === 0
      ? 0
      : Math.round((completed / total) * 100);

  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Progress
        </span>

        <span className="font-medium">
          {completed}/{total}
        </span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-[#C6FF00] transition-all duration-300"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      <p className="mt-2 text-right text-xs text-muted-foreground">
        {progress}% completed
      </p>
    </div>
  );
}