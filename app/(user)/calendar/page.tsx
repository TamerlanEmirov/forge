import { WorkoutCalendar } from "@/components/calendar/WorkoutCalendar";

export default function CalendarPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="mx-auto max-w-[1400px] px-6 py-10 lg:px-10">

        {/* HEADER */}
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#C6FF00]" />

              <span className="text-sm font-medium uppercase tracking-[0.2em] text-[#C6FF00]">
                Training
              </span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Workout Calendar
            </h1>

            <p className="mt-3 max-w-xl text-base text-white/45">
              Plan your workouts, track your progress and stay consistent.
            </p>
          </div>

          <button
            type="button"
            className="
              flex h-11 items-center justify-center
              rounded-xl border border-[#C6FF00]/30
              bg-[#C6FF00]/10 px-5
              text-sm font-semibold text-[#C6FF00]
              transition
              hover:bg-[#C6FF00]
              hover:text-black
            "
          >
            Today
          </button>
        </div>

        {/* MAIN CALENDAR */}
        <WorkoutCalendar />

      </div>
    </main>
  );
}