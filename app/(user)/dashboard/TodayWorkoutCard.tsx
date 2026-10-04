"use client";

import Link from "next/link";
import { ArrowRight, Maximize2 } from "lucide-react";

interface TodayWorkoutCardProps {
  workout: {
    name: string;
    muscleGroups: string[];
    percent: number;
    completedSets: number;
    totalSets: number;
  } | null;
}

export function TodayWorkoutCard({
  workout,
}: TodayWorkoutCardProps) {
  return (
    <div className="flex h-full min-h-[305px] flex-col rounded-2xl border border-white/10 bg-[#151515] p-6 sm:p-7 lg:p-8">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium tracking-wider text-white/40">
            TODAY&apos;S WORKOUT
          </p>

          {workout ? (
            <>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                {workout.name}
              </h2>

              {workout.muscleGroups.length > 0 && (
                <p className="mt-1.5 text-sm text-white/40">
                  {workout.muscleGroups.join(", ")}
                </p>
              )}
            </>
          ) : (
            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
              No workout scheduled
            </h2>
          )}
        </div>

        <Link
          href="/calendar"
          aria-label="Open calendar"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
        >
          <Maximize2 className="h-4 w-4" />
        </Link>
      </div>

      {workout ? (
        <div className="mt-auto pt-10">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-[#C6FF00]">
              {workout.percent}%
            </span>

            <span className="text-white/40">
              {workout.completedSets}/{workout.totalSets} sets
            </span>
          </div>

          <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-[#C6FF00] transition-all duration-500"
              style={{ width: `${workout.percent}%` }}
            />
          </div>

          <Link
            href="/calendar"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#C6FF00] py-3.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
          >
            Continue Workout
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="mt-auto pt-10">
          <Link
            href="/calendar"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/5 py-3.5 text-sm font-semibold text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            Plan a Workout
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}