interface CalorieOverviewProps {
  consumed: number;
  target: number;
}

export default function CalorieOverview({
  consumed,
  target,
}: CalorieOverviewProps) {
  const percentage = Math.min((consumed / target) * 100, 100);
  const remaining = Math.max(target - consumed, 0);

  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
    <div className="rounded-2xl border bg-card p-6">
      <div className="flex flex-col items-center">
        <div className="mb-6 text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Total Calories
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Daily target: {target.toLocaleString()} kcal
          </p>
        </div>

        {/* Circular Progress */}
        <div className="relative h-56 w-56">
          <svg
            className="h-full w-full -rotate-90"
            viewBox="0 0 220 220"
          >
            {/* Background ring */}
            <circle
              cx="110"
              cy="110"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="16"
              className="text-muted"
            />

            {/* Progress ring */}
            <circle
              cx="110"
              cy="110"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="16"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="text-primary transition-all duration-700"
            />
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold">
              {consumed.toLocaleString()}
            </span>

            <span className="text-sm text-muted-foreground">
              / {target.toLocaleString()} kcal
            </span>

            <span className="mt-2 text-xs font-medium text-primary">
              {Math.round(percentage)}%
            </span>
          </div>
        </div>

        {/* Remaining */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Remaining
          </p>

          <p className="text-xl font-semibold">
            {remaining.toLocaleString()} kcal
          </p>
        </div>
      </div>
    </div>
    </div>
  );
}