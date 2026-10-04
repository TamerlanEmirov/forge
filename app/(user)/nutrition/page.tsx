"use client";

import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";

import { DailyOverview } from "./DailyOverview";
import { FoodList } from "./FoodList";
import { AddFood } from "./AddFood";

import type {
  NutritionEntry,
  NutritionTarget,
} from "@/types/nutrition";

export default function NutritionPage() {
  const [target, setTarget] = useState<NutritionTarget | null>(null);
  const [entries, setEntries] = useState<NutritionEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const [targetRes, entriesRes] = await Promise.all([
          fetch("/api/nutrition/target"),
          fetch("/api/nutrition/entries"),
        ]);

        if (!targetRes.ok || !entriesRes.ok) {
          throw new Error("Failed to fetch nutrition data");
        }

        const targetData: NutritionTarget | null =
          await targetRes.json();
        const entriesData: NutritionEntry[] =
          await entriesRes.json();

        setTarget(targetData);
        setEntries(entriesData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const totals = entries.reduce(
    (acc, entry) => ({
      calories: acc.calories + entry.calories,
      protein: acc.protein + entry.protein,
      carbs: acc.carbs + entry.carbs,
      fats: acc.fats + entry.fats,
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  async function handleSaveTarget(payload: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  }) {
    const response = await fetch("/api/nutrition/target", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to save target");
    }

    const data: NutritionTarget = await response.json();

    setTarget(data);
  }

  function handleAdded(entry: NutritionEntry) {
    setEntries((prev) => [...prev, entry]);
    setAddOpen(false);
  }

  async function handleDelete(entryId: string) {
    const previous = entries;

    setEntries((prev) =>
      prev.filter((entry) => entry.id !== entryId)
    );

    try {
      const response = await fetch(
        `/api/nutrition/entries/${entryId}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Failed to delete entry");
      }
    } catch (error) {
      console.error(error);
      setEntries(previous);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-[1600px] px-6 py-10">
        <p className="text-sm text-white/40">Loading...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1600px] px-6 py-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[460px_1fr]">
        <DailyOverview
          target={target}
          totals={totals}
          onSaveTarget={handleSaveTarget}
        />

        <FoodList entries={entries} onDelete={handleDelete} />
      </div>

      {/* FLOATING ADD BUTTON */}

      <button
        type="button"
        onClick={() => setAddOpen(true)}
        aria-label="Add food"
        className="fixed bottom-8 right-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#C6FF00] text-black shadow-lg shadow-black/40 transition-transform hover:scale-105"
      >
        <Plus className="h-7 w-7" />
      </button>

      {/* ADD FOOD MODAL */}

      {addOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="relative w-full max-w-md">
            <button
              type="button"
              onClick={() => setAddOpen(false)}
              aria-label="Close"
              className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/60 transition-colors hover:bg-white/20 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <AddFood onAdded={handleAdded} />
          </div>
        </div>
      )}
    </div>
  );
}