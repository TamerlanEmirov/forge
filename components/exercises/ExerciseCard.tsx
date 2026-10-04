"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BicepsFlexed,
  Dumbbell,
  Play,
  Star,
  Target,
} from "lucide-react";

import type { Exercise } from "@/types/exercise";

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

interface ExerciseCardProps {
  exercise: Exercise;
  onToggleFavorite?: (exercise: Exercise) => void;
}

export function ExerciseCard({
  exercise,
  onToggleFavorite,
}: ExerciseCardProps) {
  const [playing, setPlaying] = useState(false);

  const youtubeId = getYouTubeId(exercise.videoUrl);

  const thumbnail =
    exercise.thumbnailUrl ??
    (youtubeId
      ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
      : null);

  return (
    <Link
      href={`/exercises/${exercise.id}`}
      className="
        group
        block
        overflow-hidden
        rounded-2xl
        border
        border-white/10
        bg-[#111111]
        shadow-lg
        shadow-black/10
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-[#C6FF00]/25
        hover:shadow-xl
        hover:shadow-black/30
      "
    >
      {/* =================================
          MEDIA
      ================================== */}

      <div className="relative aspect-video overflow-hidden bg-black">
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
                className="
                  h-full
                  w-full
                  object-cover
                  transition-transform
                  duration-700
                  group-hover:scale-105
                "
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-white/[0.03]">
                <Dumbbell className="h-10 w-10 text-white/15" />
              </div>
            )}

            {/* dark gradient */}

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />

            {/* PLAY */}

            {youtubeId && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setPlaying(true);
                }}
                aria-label="Play video"
                className="
                  absolute
                  inset-0
                  flex
                  items-center
                  justify-center
                "
              >
                <span
                  className="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-full
                    bg-[#C6FF00]
                    text-black
                    shadow-[0_0_30px_rgba(198,255,0,0.15)]
                    transition-all
                    duration-300
                    group-hover:scale-110
                  "
                >
                  <Play
                    className="ml-0.5 h-5 w-5"
                    fill="currentColor"
                  />
                </span>
              </button>
            )}

            {/* FAVORITE / I USED */}

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onToggleFavorite?.(exercise);
              }}
              aria-label={
                exercise.isFavorited
                  ? "Remove from I Used"
                  : "Add to I Used"
              }
              className={`
                absolute
                right-3
                top-3
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                border
                backdrop-blur-md
                transition-all
                duration-200
                ${
                  exercise.isFavorited
                    ? "border-[#C6FF00]/30 bg-[#C6FF00] text-black shadow-[0_0_18px_rgba(198,255,0,0.15)]"
                    : "border-white/10 bg-black/40 text-white/60 hover:border-[#C6FF00]/30 hover:bg-black/60 hover:text-[#C6FF00]"
                }
              `}
            >
              <BicepsFlexed className="h-4 w-4" />
            </button>

            {/* MUSCLE LABEL */}

            <div className="absolute bottom-3 left-3">
              <span className="rounded-lg border border-white/10 bg-black/50 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/80 backdrop-blur-md">
                {exercise.muscleGroup}
              </span>
            </div>
          </>
        )}
      </div>

      {/* =================================
          INFO
      ================================== */}

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-white transition-colors group-hover:text-[#C6FF00]">
              {exercise.name}
            </h3>

            {exercise.secondaryMuscles && (
              <p className="mt-1 truncate text-xs text-white/30">
                Also targets {exercise.secondaryMuscles}
              </p>
            )}
          </div>
        </div>

        {/* TAGS */}

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#C6FF00]/[0.08] px-2.5 py-1.5 text-[11px] font-medium text-[#C6FF00]">
            <Target className="h-3 w-3" />
            {exercise.muscleGroup}
          </span>

          {exercise.equipment && (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.04] px-2.5 py-1.5 text-[11px] text-white/40">
              <Dumbbell className="h-3 w-3" />
              {exercise.equipment}
            </span>
          )}
        </div>

        {/* FOOTER */}

        <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
          <div className="flex items-center gap-1.5">
            <Star
              className="h-3.5 w-3.5 text-[#C6FF00]"
              fill="currentColor"
            />

            <span className="text-xs font-medium text-white/70">
              {exercise.averageRating.toFixed(1)}
            </span>

            <span className="text-[11px] text-white/25">
              ({exercise.ratingCount})
            </span>
          </div>

          <span className="text-[11px] font-medium text-white/25 transition-colors group-hover:text-[#C6FF00]/60">
            View exercise →
          </span>
        </div>
      </div>
    </Link>
  );
}