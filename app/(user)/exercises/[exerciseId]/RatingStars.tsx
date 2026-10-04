"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface RatingStarsProps {
  value: number | null;
  onRate: (value: number) => void;
  disabled?: boolean;
}

const STAR_INDEXES = [1, 2, 3, 4, 5];

export function RatingStars({
  value,
  onRate,
  disabled,
}: RatingStarsProps) {
  const [hovered, setHovered] =
    useState<number | null>(null);

  const display = hovered ?? value ?? 0;

  return (
    <div
      className="flex items-center gap-1"
      onMouseLeave={() => setHovered(null)}
    >
      {STAR_INDEXES.map((star) => {
        const fillFraction = Math.min(
          Math.max(display - (star - 1), 0),
          1
        );

        return (
          <div
            key={star}
            className="relative size-7"
          >
            {/* EMPTY STAR */}

            <Star
              className="
                absolute
                inset-0
                size-7
                text-white/10
              "
            />

            {/* FILLED STAR */}

            <div
              className="absolute inset-0 overflow-hidden"
              style={{
                width: `${fillFraction * 100}%`,
              }}
            >
              <Star
                className="
                  size-7
                  fill-[#C6FF00]
                  text-[#C6FF00]
                  drop-shadow-[0_0_6px_rgba(198,255,0,0.2)]
                "
              />
            </div>

            {/* HALF */}

            <button
              type="button"
              disabled={disabled}
              onMouseEnter={() =>
                setHovered(star - 0.5)
              }
              onClick={() =>
                onRate(star - 0.5)
              }
              aria-label={`Rate ${
                star - 0.5
              } stars`}
              className="
                absolute
                inset-y-0
                left-0
                w-1/2
                cursor-pointer
                disabled:cursor-not-allowed
              "
            />

            {/* FULL */}

            <button
              type="button"
              disabled={disabled}
              onMouseEnter={() =>
                setHovered(star)
              }
              onClick={() =>
                onRate(star)
              }
              aria-label={`Rate ${star} stars`}
              className="
                absolute
                inset-y-0
                right-0
                w-1/2
                cursor-pointer
                disabled:cursor-not-allowed
              "
            />
          </div>
        );
      })}
    </div>
  );
}