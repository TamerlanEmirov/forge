"use client";

interface CalorieRingProps {
  consumed: number;
  target: number;
}

export function CalorieRing({ consumed, target }: CalorieRingProps) {
  const size = 240;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const ratio = target > 0 ? Math.min(consumed / target, 1) : 0;
  const offset = circumference * (1 - ratio);

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
        />

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#C6FF00"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-500"
        />
      </svg>

      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-bold text-white">
          {Math.round(consumed).toLocaleString()}
        </span>

        <span className="mt-1 text-sm font-medium tracking-wide text-white/40">
          / {Math.round(target).toLocaleString()} KCAL
        </span>
      </div>
    </div>
  );
}