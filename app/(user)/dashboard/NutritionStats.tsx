import type { ReactNode } from "react";
import { Beef, Flame } from "lucide-react";

interface NutritionStatsProps {
  target: {
    calories: number;
    protein: number;
  } | null;

  consumed: {
    calories: number;
    protein: number;
  };
}

export function NutritionStats({
  target,
  consumed,
}: NutritionStatsProps) {
  return (
    <div className="grid h-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-1">
      <StatCard
        icon={<Flame className="h-5 w-5" />}
        label="CALORIES"
        consumed={Math.round(consumed.calories)}
        target={target?.calories ?? null}
      />

      <StatCard
        icon={<Beef className="h-5 w-5" />}
        label="PROTEIN"
        consumed={Math.round(consumed.protein)}
        target={target?.protein ?? null}
        unit="g"
      />
    </div>
  );
}

function StatCard({
  icon,
  label,
  consumed,
  target,
  unit,
}: {
  icon: ReactNode;
  label: string;
  consumed: number;
  target: number | null;
  unit?: string;
}) {
  const percentage =
    target && target > 0
      ? Math.min((consumed / target) * 100, 100)
      : 0;

  return (
    <div className="flex min-h-[140px] flex-col justify-between rounded-2xl border border-white/10 bg-[#151515] p-5 transition-colors hover:border-white/15">
      <div className="flex items-center gap-2">
        <div className="text-[#C6FF00]">
          {icon}
        </div>

        <span className="text-xs font-medium tracking-wider text-white/40">
          {label}
        </span>
      </div>

      <div>
        <p className="mt-5 text-3xl font-bold tracking-tight text-white">
          {consumed.toLocaleString()}
          {target !== null && (
            <span className="ml-1.5 text-sm font-normal text-white/35">
              / {target.toLocaleString()}
              {unit}
            </span>
          )}
        </p>

        {target !== null && (
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-[#C6FF00] transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}