"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BicepsFlexed,
  Check,
  Dumbbell,
  Play,
  Target,
} from "lucide-react";

import { RatingStars } from "./RatingStars";
import type { ExerciseDetail } from "@/types/exercise";

function getYouTubeId(url: string | null) {
  if (!url) return null;

  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.slice(1);
    }

    if (parsed.hostname.includes("youtube.com")) {
      return parsed.searchParams.get("v");
    }

    return null;
  } catch {
    return null;
  }
}

export default function ExerciseDetailPage() {
  const params = useParams<{ exerciseId: string }>();
  const router = useRouter();

  const exerciseId = params.exerciseId;

  const [exercise, setExercise] =
    useState<ExerciseDetail | null>(null);

  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [submittingRating, setSubmittingRating] =
    useState(false);

  useEffect(() => {
    async function fetchExercise() {
      try {
        setLoading(true);

        const response = await fetch(
          `/api/exercises/${exerciseId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch exercise");
        }

        const data: ExerciseDetail =
          await response.json();

        setExercise(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchExercise();
  }, [exerciseId]);

  async function handleToggleFavorite() {
    if (!exercise) return;

    const previous = exercise;

    setExercise({
      ...exercise,
      isFavorited: !exercise.isFavorited,
    });

    try {
      const response = await fetch(
        "/api/user-exercises",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            exerciseId: exercise.id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to toggle favorite"
        );
      }
    } catch (error) {
      console.error(error);
      setExercise(previous);
    }
  }

  async function handleRate(value: number) {
    if (!exercise) return;

    const previous = exercise;

    setSubmittingRating(true);

    setExercise({
      ...exercise,
      userRating: value,
    });

    try {
      const response = await fetch(
        `/api/exercises/${exercise.id}/rating`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ value }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to submit rating"
        );
      }

      const data = await response.json();

      setExercise((prev) =>
        prev
          ? {
              ...prev,
              averageRating: data.averageRating,
              ratingCount: data.ratingCount,
              userRating: data.userRating,
            }
          : prev
      );
    } catch (error) {
      console.error(error);
      setExercise(previous);
    } finally {
      setSubmittingRating(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0A0A0A] text-white">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <div className="h-6 w-24 animate-pulse rounded bg-white/5" />

          <div className="mt-6 aspect-video animate-pulse rounded-3xl bg-white/5" />

          <div className="mt-6 h-8 w-64 animate-pulse rounded bg-white/5" />
        </div>
      </main>
    );
  }

  if (!exercise) {
    return (
      <main className="min-h-screen bg-[#0A0A0A] text-white">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-white/50 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="mt-16 text-center">
            <p className="text-white/40">
              Exercise not found.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const youtubeId = getYouTubeId(
    exercise.videoUrl
  );

  const thumbnail =
    exercise.thumbnailUrl ??
    (youtubeId
      ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
      : null);

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-10">

        {/* BACK */}

        <button
          type="button"
          onClick={() => router.back()}
          className="group mb-6 inline-flex items-center gap-2 text-sm text-white/40 transition-colors hover:text-white"
        >
          <span className="flex size-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] transition-colors group-hover:border-white/20 group-hover:bg-white/[0.06]">
            <ArrowLeft className="h-4 w-4" />
          </span>

          Back to exercises
        </button>

        {/* VIDEO */}

        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#111] shadow-2xl shadow-black/40">

          <div className="relative aspect-video w-full bg-black">

            {playing && youtubeId ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1`}
                title={exercise.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            ) : (
              <>
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt={exercise.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-white/[0.03]">
                    <Dumbbell className="h-12 w-12 text-white/10" />
                  </div>
                )}

                {/* DARK OVERLAY */}

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                {/* PLAY */}

                {youtubeId && (
                  <button
                    type="button"
                    onClick={() =>
                      setPlaying(true)
                    }
                    className="absolute inset-0 flex items-center justify-center"
                    aria-label="Play exercise video"
                  >
                    <span className="flex size-16 items-center justify-center rounded-full bg-[#C6FF00] text-black shadow-[0_0_40px_rgba(198,255,0,0.18)] transition-transform duration-200 hover:scale-110">
                      <Play
                        className="ml-1 h-6 w-6"
                        fill="currentColor"
                      />
                    </span>
                  </button>
                )}
              </>
            )}

            {/* FAVORITE */}

            <button
              type="button"
              onClick={handleToggleFavorite}
              aria-label={
                exercise.isFavorited
                  ? "Remove from favorites"
                  : "Add to favorites"
              }
              className={`absolute right-4 top-4 inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-medium backdrop-blur-xl transition-all ${
                exercise.isFavorited
                  ? "border-[#C6FF00]/30 bg-[#C6FF00] text-black"
                  : "border-white/10 bg-black/40 text-white/70 hover:border-white/20 hover:text-white"
              }`}
            >
              {exercise.isFavorited ? (
                <>
                  <Check className="h-4 w-4" />
                  I use it
                </>
              ) : (
                <>
                  <BicepsFlexed className="h-4 w-4" />
                  I use it
                </>
              )}
            </button>
          </div>
        </div>

        {/* MAIN INFO */}

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">

          {/* LEFT */}

          <div>

            {/* TITLE */}

            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C6FF00] shadow-[0_0_8px_#C6FF00]" />

                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C6FF00]">
                  Exercise
                </span>
              </div>

              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {exercise.name}
              </h1>
            </div>

            {/* TAGS */}

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-xl border border-[#C6FF00]/15 bg-[#C6FF00]/[0.07] px-3 py-2 text-xs font-medium text-[#C6FF00]">
                <Target className="h-3.5 w-3.5" />
                {exercise.muscleGroup}
              </span>

              {exercise.equipment && (
                <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white/50">
                  <Dumbbell className="h-3.5 w-3.5" />
                  {exercise.equipment}
                </span>
              )}
            </div>

            {/* SECONDARY */}

            {exercise.secondaryMuscles && (
              <div className="mt-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/30">
                  Secondary muscles
                </p>

                <p className="mt-2 text-sm text-white/60">
                  {exercise.secondaryMuscles}
                </p>
              </div>
            )}

            {/* DESCRIPTION */}

            {exercise.description && (
              <div className="mt-7">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/30">
                  About this exercise
                </p>

                <p className="max-w-2xl text-sm leading-7 text-white/55">
                  {exercise.description}
                </p>
              </div>
            )}
          </div>

          {/* RIGHT — RATING */}

          <div className="h-fit rounded-2xl border border-white/10 bg-white/[0.025] p-5">

            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/30">
                  Community rating
                </p>

                <div className="mt-2 flex items-end gap-2">
                  <span className="text-3xl font-semibold text-white">
                    {exercise.averageRating.toFixed(1)}
                  </span>

                  <span className="pb-1 text-xs text-white/30">
                    / 5
                  </span>
                </div>
              </div>

              <div className="flex size-10 items-center justify-center rounded-xl bg-[#C6FF00]/10">
                <Target className="h-5 w-5 text-[#C6FF00]" />
              </div>
            </div>

            <div className="my-5 h-px bg-white/10" />

            <p className="mb-3 text-xs text-white/40">
              Rate this exercise
            </p>

            <RatingStars
              value={exercise.userRating}
              onRate={handleRate}
              disabled={submittingRating}
            />

            <p className="mt-3 text-[11px] text-white/25">
              {exercise.ratingCount}{" "}
              {exercise.ratingCount === 1
                ? "rating"
                : "ratings"}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}