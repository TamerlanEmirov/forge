"use client";

import { Trash2, Utensils } from "lucide-react";

import type { NutritionEntry } from "@/types/nutrition";

interface FoodListProps {
  entries: NutritionEntry[];
  onDelete: (entryId: string) => void;
}

export function FoodList({ entries, onDelete }: FoodListProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#151515] p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">
          Meals Log
        </h2>

        <span className="text-xs font-medium tracking-wider text-white/30">
          TODAY
        </span>
      </div>

      {entries.length === 0 ? (
        <p className="mt-8 text-sm text-white/40">
          No food logged yet today.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between rounded-xl bg-white/5 px-5 py-4"
            >
              <div className="flex items-center gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#C6FF00]/10 text-[#C6FF00]">
                  <Utensils className="h-5 w-5" />
                </span>

                <div>
                  <p className="text-base font-medium text-white">
                    {entry.foodName}
                  </p>

                  <p className="mt-0.5 text-sm text-white/40">
                    {new Date(entry.createdAt).toLocaleTimeString(
                      [],
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="whitespace-nowrap text-base font-semibold text-white">
                  {Math.round(entry.calories)}{" "}
                  <span className="text-xs font-normal text-white/40">
                    KCAL
                  </span>
                </span>

                <button
                  type="button"
                  onClick={() => onDelete(entry.id)}
                  aria-label="Remove entry"
                  className="rounded-full p-1.5 text-white/20 transition-colors hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}