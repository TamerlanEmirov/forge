"use client";

import type { Workout } from "@/types/workout";

interface WorkoutOverviewProps {
  workouts: Workout[];
}

export function WorkoutOverview({
  workouts,
}: WorkoutOverviewProps) {
  const totalWorkouts = workouts.length;

  const totalExercises = workouts.reduce(
    (total, workout) =>
      total + (workout.exercises?.length ?? 0),
    0
  );

  const completedExercises = workouts.reduce(
    (total, workout) =>
      total +
      (workout.exercises?.filter(
        (exercise) => exercise.completed
      ).length ?? 0),
    0
  );

  const completionRate =
    totalExercises > 0
      ? Math.round(
          (completedExercises / totalExercises) * 100
        )
      : 0;

  return (
    <section className="mb-8">
      {/* HEADER */}

      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white">
          Overview
        </h2>

        <p className="mt-1 text-sm text-white/40">
          Your workout progress at a glance.
        </p>
      </div>

      {/* STATS */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* TOTAL WORKOUTS */}

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-white/40">
            Total Workouts
          </p>

          <div className="mt-3 flex items-end justify-between">
            <span className="text-3xl font-semibold text-white">
              {totalWorkouts}
            </span>

            <span className="text-xs text-[#C6FF00]">
              workouts
            </span>
          </div>
        </div>

        {/* TOTAL EXERCISES */}

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-white/40">
            Total Exercises
          </p>

          <div className="mt-3 flex items-end justify-between">
            <span className="text-3xl font-semibold text-white">
              {totalExercises}
            </span>

            <span className="text-xs text-[#C6FF00]">
              exercises
            </span>
          </div>
        </div>

        {/* COMPLETED */}

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-white/40">
            Completed
          </p>

          <div className="mt-3 flex items-end justify-between">
            <span className="text-3xl font-semibold text-white">
              {completedExercises}
            </span>

            <span className="text-xs text-[#C6FF00]">
              done
            </span>
          </div>
        </div>

        {/* COMPLETION */}

        <div className="rounded-2xl border border-white/10 bg-[#C6FF00]/10 p-5">
          <p className="text-sm text-white/50">
            Completion Rate
          </p>

          <div className="mt-3 flex items-end justify-between">
            <span className="text-3xl font-semibold text-[#C6FF00]">
              {completionRate}%
            </span>

            <span className="text-xs text-[#C6FF00]/70">
              progress
            </span>
          </div>

          {/* SMALL PROGRESS BAR */}

          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-[#C6FF00] transition-all duration-500"
              style={{
                width: `${completionRate}%`,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}