interface WeeklyConsistencyProps {
  days: {
    date: string;
    isToday: boolean;
    hasWorkout: boolean;
    percent: number;
  }[];
}

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

function getFillClass(
  hasWorkout: boolean,
  percent: number
) {
  if (!hasWorkout) return "bg-white/5";

  if (percent >= 90) return "bg-[#C6FF00]";
  if (percent >= 60) return "bg-[#C6FF00]/70";
  if (percent >= 30) return "bg-[#C6FF00]/40";

  return "bg-[#C6FF00]/20";
}

export function WeeklyConsistency({
  days,
}: WeeklyConsistencyProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#151515] p-6 sm:p-7">
      <p className="text-xs font-medium tracking-wider text-white/40">
        WEEKLY CONSISTENCY
      </p>

      <div className="mt-6 grid grid-cols-7 gap-3">
        {days.map((day, index) => (
          <div
            key={day.date}
            className="flex flex-col items-center gap-2"
          >
            <div
              className={`h-11 w-full max-w-14 rounded-xl ${getFillClass(
                day.hasWorkout,
                day.percent
              )} ${
                day.isToday
                  ? "ring-2 ring-white/30 ring-offset-2 ring-offset-[#151515]"
                  : ""
              }`}
            />

            <span className="text-xs font-medium text-white/30">
              {DAY_LABELS[index]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}