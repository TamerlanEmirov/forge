import {
  CalendarDays,
  Dumbbell,
  Utensils,
  TrendingUp,
} from "lucide-react";

const features = [
  {
    number: "01",
    icon: CalendarDays,
    title: "Workout Intelligence",
    description:
      "Build your weekly training structure and track every set, rep and movement.",
  },
  {
    number: "02",
    icon: Dumbbell,
    title: "Exercise Library",
    description:
      "Discover exercises, movements and complete programs built around your goals.",
  },
  {
    number: "03",
    icon: Utensils,
    title: "Nutrition Tracking",
    description:
      "Track calories and macros while comparing your daily intake against your target.",
  },
  {
    number: "04",
    icon: TrendingUp,
    title: "Progress Analytics",
    description:
      "Turn your training history into useful data and see whether you're actually improving.",
  },
];

export function Features() {
  return (
    <section
      id="platform"
      className="border-t border-white/10 bg-[#0A0A0A] px-6 py-24"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#C6FF00]">
              / 01 — PLATFORM
            </p>

            <h2 className="max-w-2xl text-4xl font-medium uppercase tracking-[-0.04em] text-white sm:text-6xl">
              Engineered for
              <span className="block text-white/40">
                Elite Tracking
              </span>
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-6 text-white/45">
            Everything you need to turn training consistency into measurable
            performance.
          </p>
        </div>

        <div className="grid border-l border-t border-white/10 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.number}
                className="group min-h-[280px] border-b border-r border-white/10 p-7 transition hover:bg-white/[0.025]"
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-[10px] text-white/25">
                    {feature.number}
                  </span>

                  <Icon
                    size={20}
                    strokeWidth={1.5}
                    className="text-[#C6FF00] transition-transform group-hover:scale-110"
                  />
                </div>

                <div className="mt-20">
                  <h3 className="text-xl font-semibold uppercase tracking-tight text-white">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-white/40">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}