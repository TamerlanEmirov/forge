interface RecentActivityProps {
  items: {
    id: string;
    name: string;
    date: string;
    percent: number;
  }[];
}

export function RecentActivity({
  items,
}: RecentActivityProps) {
  return (
    <div className="h-full rounded-2xl border border-white/10 bg-[#151515] p-6 sm:p-7">
      <p className="text-xs font-medium tracking-wider text-white/40">
        RECENT ACTIVITY
      </p>

      {items.length === 0 ? (
        <p className="mt-5 text-sm text-white/40">
          No past workouts yet.
        </p>
      ) : (
        <div className="mt-5 space-y-1">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-l-2 border-[#C6FF00] py-3 pl-4 transition-colors hover:bg-white/[0.02]"
            >
              <div>
                <p className="text-xs text-white/40">
                  {new Date(item.date).toLocaleDateString(
                    undefined,
                    {
                      weekday: "long",
                    }
                  )}
                </p>

                <p className="mt-0.5 text-base font-semibold text-white">
                  {item.name}
                </p>
              </div>

              <span className="text-sm font-semibold text-[#C6FF00]">
                {item.percent}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}