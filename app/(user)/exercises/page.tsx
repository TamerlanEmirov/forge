"use client";

import { useEffect, useState } from "react";
import {
  BicepsFlexed,
  Dumbbell,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import type { Exercise } from "@/types/exercise";
import { ExerciseCard } from "@/components/exercises/ExerciseCard";

const MUSCLE_GROUPS = [
  "All",
  "Chest",
  "Back",
  "Shoulders",
  "Legs",
  "Biceps",
  "Triceps",
  "Core",
];

export default function ExercisesPage() {
  const [query, setQuery] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("All");
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchExercises() {
      try {
        setLoading(true);

        const params = new URLSearchParams();

        if (query.trim()) {
          params.set("q", query.trim());
        }

        if (muscleGroup !== "All") {
          params.set("muscleGroup", muscleGroup);
        }

        if (favoritesOnly) {
          params.set("favoritesOnly", "true");
        }

        const queryString = params.toString();

        const response = await fetch(
          `/api/exercises${
            queryString ? `?${queryString}` : ""
          }`,
          {
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch exercises");
        }

        const data: Exercise[] = await response.json();

        setExercises(data);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error(error);
        }
      } finally {
        setLoading(false);
      }
    }

    const timeout = setTimeout(fetchExercises, 300);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query, muscleGroup, favoritesOnly]);

  async function handleToggleFavorite(exercise: Exercise) {
    const previous = exercises;

    setExercises((prev) =>
      prev.map((item) =>
        item.id === exercise.id
          ? {
              ...item,
              isFavorited: !item.isFavorited,
            }
          : item
      )
    );

    try {
      const response = await fetch("/api/user-exercises", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          exerciseId: exercise.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to toggle favorite");
      }
    } catch (error) {
      console.error(error);
      setExercises(previous);
    }
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* =================================
            HEADER
        ================================== */}

        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#111111] px-6 py-10 sm:px-10 lg:px-12 lg:py-12">
          {/* subtle glow */}

          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#C6FF00]/[0.06] blur-3xl" />

          <div className="relative max-w-3xl">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#C6FF00] shadow-[0_0_12px_#C6FF00]" />

              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C6FF00]">
                Exercise Library
              </span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Find your next
              <span className="text-[#C6FF00]"> movement.</span>
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/45 sm:text-base">
              Explore exercises by muscle group, equipment and
              movement. Save the exercises you use most and build
              better workouts.
            </p>

            {/* SEARCH */}

            <div className="relative mt-8 max-w-2xl">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30" />

              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search exercises, muscles..."
                className="
                  h-14
                  rounded-2xl
                  border-white/10
                  bg-white/[0.04]
                  pl-12
                  pr-4
                  text-sm
                  text-white
                  shadow-xl
                  shadow-black/10
                  placeholder:text-white/25
                  transition
                  focus-visible:border-[#C6FF00]/40
                  focus-visible:ring-2
                  focus-visible:ring-[#C6FF00]/10
                "
              />
            </div>
          </div>
        </section>

        {/* =================================
            FILTER BAR
        ================================== */}

        <section className="mt-6">
          <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#111111] p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#C6FF00]/10">
                <SlidersHorizontal className="h-4 w-4 text-[#C6FF00]" />
              </div>

              <div className="hidden shrink-0 sm:block">
                <p className="text-xs font-medium text-white">
                  Muscle group
                </p>

                <p className="text-[10px] text-white/30">
                  Filter exercises
                </p>
              </div>

              <div className="h-6 w-px shrink-0 bg-white/10" />

              <div className="flex min-w-0 gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {MUSCLE_GROUPS.map((group) => (
                  <button
                    key={group}
                    type="button"
                    onClick={() => setMuscleGroup(group)}
                    className={`
                      shrink-0
                      rounded-xl
                      px-3.5
                      py-2
                      text-xs
                      font-medium
                      transition-all
                      duration-200
                      ${
                        muscleGroup === group
                          ? "bg-[#C6FF00] text-black shadow-[0_0_18px_rgba(198,255,0,0.08)]"
                          : "bg-white/[0.04] text-white/45 hover:bg-white/[0.08] hover:text-white"
                      }
                    `}
                  >
                    {group}
                  </button>
                ))}
              </div>
            </div>

            {/* I USED */}

            <button
              type="button"
              onClick={() =>
                setFavoritesOnly((prev) => !prev)
              }
              className={`
                inline-flex
                shrink-0
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                px-4
                py-2.5
                text-xs
                font-semibold
                transition-all
                duration-200
                ${
                  favoritesOnly
                    ? "border-[#C6FF00]/30 bg-[#C6FF00] text-black"
                    : "border-white/10 bg-white/[0.03] text-white/55 hover:border-[#C6FF00]/20 hover:text-white"
                }
              `}
            >
              <BicepsFlexed className="h-4 w-4" />

              I Used

              {favoritesOnly && (
                <span className="h-1.5 w-1.5 rounded-full bg-black" />
              )}
            </button>
          </div>
        </section>

        {/* =================================
            RESULTS HEADER
        ================================== */}

        <div className="mt-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/25">
              Library
            </p>

            <h2 className="mt-1 text-xl font-semibold">
              Exercises
            </h2>
          </div>

          {!loading && (
            <span className="text-xs text-white/30">
              {exercises.length}{" "}
              {exercises.length === 1
                ? "exercise"
                : "exercises"}
            </span>
          )}
        </div>

        {/* =================================
            RESULTS
        ================================== */}

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {loading && exercises.length === 0 ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-white/10 bg-[#111111]"
              >
                <div className="aspect-video animate-pulse bg-white/[0.04]" />

                <div className="space-y-3 p-5">
                  <div className="h-4 w-2/3 animate-pulse rounded bg-white/[0.06]" />

                  <div className="h-3 w-1/2 animate-pulse rounded bg-white/[0.04]" />

                  <div className="h-3 w-1/3 animate-pulse rounded bg-white/[0.04]" />
                </div>
              </div>
            ))
          ) : exercises.length === 0 ? (
            <div className="col-span-full rounded-3xl border border-dashed border-white/10 bg-[#111111] px-6 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C6FF00]/10">
                <Dumbbell className="h-5 w-5 text-[#C6FF00]" />
              </div>

              <h3 className="mt-4 text-sm font-semibold">
                No exercises found
              </h3>

              <p className="mt-1 text-xs text-white/30">
                Try another exercise name or muscle group.
              </p>
            </div>
          ) : (
            exercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                onToggleFavorite={handleToggleFavorite}
              />
            ))
          )}
        </div>
      </div>
    </main>
  );
}