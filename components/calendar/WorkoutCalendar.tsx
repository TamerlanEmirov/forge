"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Calendar } from "@/components/ui/calendar";
import { CalendarModal } from "./CalendarModal";

import type { Workout } from "@/types/workout";

// --------------------------------
// HELPERS
// --------------------------------

function dateKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

interface DayInfo {
  name: string;
  ratio: number;
  hasExercises: boolean;
}

function getHeatLevel(info: DayInfo) {
  if (!info.hasExercises || info.ratio === 0) {
    return 0;
  }

  if (info.ratio <= 0.25) return 1;
  if (info.ratio <= 0.5) return 2;
  if (info.ratio <= 0.75) return 3;
  if (info.ratio < 1) return 4;

  return 5;
}

const HEAT_CLASSNAMES: Record<number, string> = {
  0: "bg-[#C6FF00]/5",
  1: "bg-[#C6FF00]/15",
  2: "bg-[#C6FF00]/30",
  3: "bg-[#C6FF00]/50",
  4: "bg-[#C6FF00]/75",
  5: "bg-[#C6FF00] text-black font-semibold",
};

// --------------------------------
// COMPONENT
// --------------------------------

export function WorkoutCalendar() {
  const [date, setDate] =
    useState<Date | undefined>();

  const [workouts, setWorkouts] =
    useState<Workout[]>([]);

  const [selectedWorkout, setSelectedWorkout] =
    useState<Workout | null>(null);

  const [createOpen, setCreateOpen] =
    useState(false);

  const [workoutName, setWorkoutName] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  // --------------------------------
  // GET WORKOUTS
  // --------------------------------

  async function fetchWorkouts() {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        "/api/workouts"
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch workouts"
        );
      }

      const data: Workout[] =
        await response.json();

      setWorkouts(data);
    } catch (error) {
      console.error(error);

      setError(
        "We couldn't load your workouts."
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchWorkouts();
  }, []);

  // --------------------------------
  // HEATMAP
  // --------------------------------

  const heatMap = useMemo(() => {
    const map = new Map<
      string,
      DayInfo
    >();

    for (const workout of workouts) {
      const key = dateKey(
        new Date(workout.date)
      );

      const exercises =
        workout.exercises ?? [];

      const total =
        exercises.length;

      const completed =
        exercises.filter(
          (exercise) =>
            exercise.completed
        ).length;

      map.set(key, {
        name: workout.name,

        ratio:
          total > 0
            ? completed / total
            : 0,

        hasExercises:
          total > 0,
      });
    }

    return map;
  }, [workouts]);

  // --------------------------------
  // HEAT MODIFIERS
  // --------------------------------

  function heatLevelMatcher(
    level: number
  ) {
    return (day: Date) => {
      const info =
        heatMap.get(
          dateKey(day)
        );

      if (!info) return false;

      return (
        getHeatLevel(info) ===
        level
      );
    };
  }

  const modifiers = {
    heat0:
      heatLevelMatcher(0),

    heat1:
      heatLevelMatcher(1),

    heat2:
      heatLevelMatcher(2),

    heat3:
      heatLevelMatcher(3),

    heat4:
      heatLevelMatcher(4),

    heat5:
      heatLevelMatcher(5),
  };

  const modifiersClassNames = {
    heat0:
      HEAT_CLASSNAMES[0],

    heat1:
      HEAT_CLASSNAMES[1],

    heat2:
      HEAT_CLASSNAMES[2],

    heat3:
      HEAT_CLASSNAMES[3],

    heat4:
      HEAT_CLASSNAMES[4],

    heat5:
      HEAT_CLASSNAMES[5],
  };

  // --------------------------------
  // FIND WORKOUT
  // --------------------------------

  function getWorkoutForDate(
    selectedDate: Date
  ) {
    return workouts.find(
      (workout) => {
        const workoutDate =
          new Date(
            workout.date
          );

        return (
          workoutDate.getFullYear() ===
            selectedDate.getFullYear() &&
          workoutDate.getMonth() ===
            selectedDate.getMonth() &&
          workoutDate.getDate() ===
            selectedDate.getDate()
        );
      }
    );
  }

  // --------------------------------
  // SELECT DATE
  // --------------------------------

  function handleSelectDate(
    selectedDate:
      | Date
      | undefined
  ) {
    if (!selectedDate) return;

    setDate(selectedDate);

    const workout =
      getWorkoutForDate(
        selectedDate
      );

    if (workout) {
      setSelectedWorkout(
        workout
      );
    } else {
      setWorkoutName("");
      setCreateOpen(true);
    }
  }

  // --------------------------------
  // CREATE WORKOUT
  // --------------------------------

  async function handleCreateWorkout() {
    if (
      !date ||
      !workoutName.trim()
    ) {
      return;
    }

    try {
      const response =
        await fetch(
          "/api/workouts",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              name:
                workoutName.trim(),

              date:
                date.toISOString(),
            }),
          }
        );

      if (!response.ok) {
        throw new Error(
          "Failed to create workout"
        );
      }

      const workout: Workout =
        await response.json();

      setWorkouts((prev) => [
        ...prev,
        workout,
      ]);

      setCreateOpen(false);
      setWorkoutName("");

      setSelectedWorkout(
        workout
      );
    } catch (error) {
      console.error(error);
    }
  }

  // --------------------------------
  // SUMMARY
  // --------------------------------

  const totalWorkouts =
    workouts.length;

  const totalExercises =
    workouts.reduce(
      (total, workout) =>
        total +
        (workout.exercises
          ?.length ?? 0),
      0
    );

  const completedExercises =
    workouts.reduce(
      (total, workout) =>
        total +
        (workout.exercises?.filter(
          (exercise) =>
            exercise.completed
        ).length ?? 0),
      0
    );

  const completionRate =
    totalExercises > 0
      ? Math.round(
          (completedExercises /
            totalExercises) *
            100
        )
      : 0;

  // --------------------------------
  // SELECTED DAY
  // --------------------------------

  const selectedDayWorkout =
    date
      ? getWorkoutForDate(date)
      : undefined;

  const selectedDayInfo =
    date
      ? heatMap.get(
          dateKey(date)
        )
      : undefined;

  // --------------------------------
  // RENDER
  // --------------------------------

  return (
    <>
      {/* ================================
          MAIN CARD
      ================================= */}

      <div
        className="
          overflow-hidden
          rounded-3xl
          border border-white/10
          bg-[#111111]
          shadow-2xl
        "
      >
        <div className="grid lg:grid-cols-[1fr_340px]">

          {/* ============================
              CALENDAR SIDE
          ============================= */}

          <div
            className="
              min-h-[620px]
              border-b
              border-white/10
              p-6
              md:p-10
              lg:border-b-0
              lg:border-r
            "
          >
            {/* HEADER */}

            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/35">
                  Schedule
                </p>

                <h2 className="mt-2 text-2xl font-semibold">
                  Your training days
                </h2>
              </div>

              <div
                className="
                  hidden
                  items-center
                  gap-2
                  rounded-full
                  border border-[#C6FF00]/20
                  bg-[#C6FF00]/5
                  px-3
                  py-2
                  text-xs
                  text-[#C6FF00]
                  sm:flex
                "
              >
                <span className="h-2 w-2 rounded-full bg-[#C6FF00]" />

                {totalWorkouts} workouts
              </div>
            </div>

            {/* CALENDAR / LOADING / ERROR */}

            <div className="flex justify-center">

              {isLoading ? (
                <div
                  className="
                    flex
                    min-h-[420px]
                    w-full
                    max-w-[620px]
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-white/5
                    bg-white/[0.01]
                  "
                >
                  <div className="flex flex-col items-center gap-4">

                    <div
                      className="
                        h-8
                        w-8
                        animate-spin
                        rounded-full
                        border-2
                        border-white/10
                        border-t-[#C6FF00]
                      "
                    />

                    <p className="text-sm text-white/40">
                      Loading your workouts...
                    </p>

                  </div>
                </div>
              ) : error ? (
                <div
                  className="
                    flex
                    min-h-[420px]
                    w-full
                    max-w-[620px]
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-red-500/20
                    bg-red-500/[0.02]
                  "
                >
                  <div className="flex flex-col items-center text-center">

                    <div
                      className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        bg-red-500/10
                        text-red-400
                      "
                    >
                      !
                    </div>

                    <p className="mt-4 text-sm text-red-400">
                      {error}
                    </p>

                    <button
                      type="button"
                      onClick={
                        fetchWorkouts
                      }
                      className="
                        mt-5
                        rounded-xl
                        bg-[#C6FF00]
                        px-5
                        py-2.5
                        text-sm
                        font-semibold
                        text-black
                        transition
                        hover:bg-[#d4ff45]
                      "
                    >
                      Try again
                    </button>

                  </div>
                </div>
              ) : (
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={
                    handleSelectDate
                  }
                  modifiers={
                    modifiers
                  }
                  modifiersClassNames={
                    modifiersClassNames
                  }
                  className="
                    w-full
                    max-w-[620px]
                    rounded-2xl
                    border-0
                    bg-transparent
                    p-0
                  "
                />
              )}

            </div>

            {/* LEGEND */}

            {!isLoading &&
              !error && (
                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">

                  <div className="flex items-center gap-3">

                    <span className="text-xs text-white/40">
                      Completion
                    </span>

                    <div className="flex items-center gap-1">

                      <span className="h-3 w-3 rounded-sm bg-[#C6FF00]/10" />

                      <span className="h-3 w-3 rounded-sm bg-[#C6FF00]/30" />

                      <span className="h-3 w-3 rounded-sm bg-[#C6FF00]/50" />

                      <span className="h-3 w-3 rounded-sm bg-[#C6FF00]/75" />

                      <span className="h-3 w-3 rounded-sm bg-[#C6FF00]" />

                    </div>

                    <span className="text-xs text-white/30">
                      Less
                    </span>

                    <span className="text-xs text-white/30">
                      More
                    </span>

                  </div>

                  <div className="flex items-center gap-2 text-xs text-white/40">

                    <span className="h-2 w-2 rounded-full bg-[#C6FF00]" />

                    Workout day

                  </div>

                </div>
              )}

          </div>

          {/* ============================
              SUMMARY SIDE
          ============================= */}

          <aside className="bg-[#0D0D0D] p-6 md:p-8">

            {/* HEADER */}

            <div className="mb-8">

              <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#C6FF00]">
                Overview
              </p>

              <h3 className="mt-2 text-xl font-semibold">
                Training progress
              </h3>

            </div>

            {/* MAIN PROGRESS */}

            <div
              className="
                rounded-2xl
                border border-[#C6FF00]/20
                bg-[#C6FF00]/5
                p-5
              "
            >

              <div className="flex items-end justify-between">

                <div>

                  <p className="text-sm text-white/45">
                    Exercise completion
                  </p>

                  <p className="mt-2 text-4xl font-bold text-[#C6FF00]">
                    {completionRate}%
                  </p>

                </div>

                <span className="text-sm text-white/35">
                  {completedExercises}/
                  {totalExercises}
                </span>

              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">

                <div
                  className="
                    h-full
                    rounded-full
                    bg-[#C6FF00]
                    transition-all
                    duration-500
                  "
                  style={{
                    width: `${completionRate}%`,
                  }}
                />

              </div>

            </div>

            {/* STATS */}

            <div className="mt-4 grid grid-cols-2 gap-3">

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">

                <p className="text-xs text-white/35">
                  Workouts
                </p>

                <p className="mt-2 text-2xl font-semibold">
                  {totalWorkouts}
                </p>

              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">

                <p className="text-xs text-white/35">
                  Exercises
                </p>

                <p className="mt-2 text-2xl font-semibold">
                  {totalExercises}
                </p>

              </div>

            </div>

            {/* SELECTED DAY */}

            <div className="mt-8">

              <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-white/35">
                Selected day
              </p>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">

                <p className="text-sm text-white/40">

                  {date
                    ? date.toLocaleDateString(
                        undefined,
                        {
                          weekday:
                            "long",
                          month:
                            "long",
                          day:
                            "numeric",
                        }
                      )
                    : "Select a day"}

                </p>

                {selectedDayWorkout ? (
                  <>

                    <h4 className="mt-3 text-lg font-semibold">
                      {
                        selectedDayWorkout.name
                      }
                    </h4>

                    <div className="mt-4 flex items-center justify-between">

                      <span className="text-sm text-white/40">
                        Exercises
                      </span>

                      <span className="font-semibold text-[#C6FF00]">
                        {
                          selectedDayWorkout
                            .exercises
                            ?.length ?? 0
                        }
                      </span>

                    </div>

                    {selectedDayInfo && (
                      <div className="mt-4">

                        <div className="mb-2 flex justify-between text-xs">

                          <span className="text-white/35">
                            Progress
                          </span>

                          <span className="text-[#C6FF00]">
                            {Math.round(
                              selectedDayInfo.ratio *
                                100
                            )}
                            %
                          </span>

                        </div>

                        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">

                          <div
                            className="
                              h-full
                              rounded-full
                              bg-[#C6FF00]
                              transition-all
                              duration-500
                            "
                            style={{
                              width: `${
                                selectedDayInfo.ratio *
                                100
                              }%`,
                            }}
                          />

                        </div>

                      </div>
                    )}

                  </>
                ) : (
                  <div className="mt-4">

                    <p className="text-sm text-white/35">
                      No workout scheduled.
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        date &&
                        setCreateOpen(
                          true
                        )
                      }
                      disabled={!date}
                      className="
                        mt-4
                        rounded-lg
                        bg-[#C6FF00]
                        px-4
                        py-2
                        text-sm
                        font-semibold
                        text-black
                        transition
                        hover:bg-[#d4ff45]
                        disabled:cursor-not-allowed
                        disabled:opacity-40
                      "
                    >
                      Add Workout
                    </button>

                  </div>
                )}

              </div>

            </div>

          </aside>

        </div>
      </div>

      {/* ================================
          CREATE WORKOUT MODAL
      ================================= */}

      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#151515] p-7 shadow-2xl">

            <div className="mb-6">

              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#C6FF00]/10">

                <span className="text-lg text-[#C6FF00]">
                  +
                </span>

              </div>

              <h2 className="text-2xl font-semibold">
                Create Workout
              </h2>

              <p className="mt-2 text-sm text-white/40">
                Schedule a workout for{" "}
                {date?.toLocaleDateString()}
              </p>

            </div>

            <input
              value={workoutName}
              onChange={(e) =>
                setWorkoutName(
                  e.target.value
                )
              }
              placeholder="e.g. Push Day"
              className="
                w-full
                rounded-xl
                border border-white/10
                bg-white/[0.03]
                px-4
                py-3
                text-white
                outline-none
                transition
                placeholder:text-white/25
                focus:border-[#C6FF00]/50
                focus:ring-2
                focus:ring-[#C6FF00]/10
              "
            />

            <div className="mt-6 flex justify-end gap-3">

              <button
                onClick={() =>
                  setCreateOpen(
                    false
                  )
                }
                className="
                  rounded-xl
                  px-5
                  py-2.5
                  text-sm
                  text-white/45
                  transition
                  hover:bg-white/5
                  hover:text-white
                "
              >
                Cancel
              </button>

              <button
                onClick={
                  handleCreateWorkout
                }
                disabled={
                  !workoutName.trim()
                }
                className="
                  rounded-xl
                  bg-[#C6FF00]
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  text-black
                  transition
                  hover:bg-[#d4ff45]
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                Create Workout
              </button>

            </div>

          </div>

        </div>
      )}

      {/* ================================
          WORKOUT MODAL
      ================================= */}

      {selectedWorkout && (
        <CalendarModal
          key={selectedWorkout.id}
          workout={selectedWorkout}
          date={date}
          open={true}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedWorkout(
                null
              );
            }
          }}
        />
      )}

    </>
  );
}