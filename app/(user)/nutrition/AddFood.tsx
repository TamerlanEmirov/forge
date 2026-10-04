"use client";

import { useState } from "react";
import { Loader2, Plus, Sparkles } from "lucide-react";

import type { NutritionEntry } from "@/types/nutrition";

interface AnalyzedFood {
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface AddFoodProps {
  onAdded: (entry: NutritionEntry) => void;
}

export function AddFood({ onAdded }: AddFoodProps) {
  const [description, setDescription] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState<AnalyzedFood | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAnalyze() {
    if (!description.trim()) return;

    setError(null);
    setPreview(null);

    try {
      setAnalyzing(true);

      const response = await fetch("/api/nutrition/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          foodDescription: description.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze food");
      }

      const data: AnalyzedFood = await response.json();

      setPreview(data);
    } catch (err) {
      console.error(err);
      setError("Could not analyze this food. Try rephrasing it.");
    } finally {
      setAnalyzing(false);
    }
  }

  async function handleConfirm() {
    if (!preview) return;

    try {
      setSaving(true);

      const response = await fetch("/api/nutrition/entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: new Date().toISOString(),
          ...preview,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save entry");
      }

      const entry: NutritionEntry = await response.json();

      onAdded(entry);

      setDescription("");
      setPreview(null);
    } catch (err) {
      console.error(err);
      setError("Could not save this entry.");
    } finally {
      setSaving(false);
    }
  }

  function handleDiscard() {
    setPreview(null);
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#151515] p-6">
      <h2 className="text-lg font-semibold text-white">Add Food</h2>

      <p className="mt-1 text-sm text-white/40">
        Describe what you ate, AI estimates the nutrition.
      </p>

      <div className="mt-4 flex gap-2">
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAnalyze();
          }}
          placeholder="e.g. 200g grilled chicken breast"
          className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-[#C6FF00]/50"
        />

        <button
          type="button"
          onClick={handleAnalyze}
          disabled={!description.trim() || analyzing}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#C6FF00] px-4 py-2.5 text-sm font-medium text-black transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {analyzing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          Analyze
        </button>
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-400">{error}</p>
      )}

      {preview && (
        <div className="mt-4 rounded-xl border border-[#C6FF00]/20 bg-[#C6FF00]/5 p-4">
          <p className="font-medium text-white">{preview.foodName}</p>

          <div className="mt-3 grid grid-cols-4 gap-2 text-center">
            <MacroPreview label="Cal" value={preview.calories} unit="kcal" />
            <MacroPreview label="Protein" value={preview.protein} unit="g" />
            <MacroPreview label="Carbs" value={preview.carbs} unit="g" />
            <MacroPreview label="Fats" value={preview.fats} unit="g" />
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleDiscard}
              className="px-4 py-2 text-sm text-white/50 transition-colors hover:text-white"
            >
              Discard
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#C6FF00] px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              <Plus className="h-4 w-4" />
              {saving ? "Adding..." : "Add to Log"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MacroPreview({
  label,
  value,
  unit,
}: {
  label: string;
  value: number;
  unit: string;
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-white">
        {Math.round(value)}
        <span className="ml-0.5 text-xs font-normal text-white/40">
          {unit}
        </span>
      </p>
      <p className="text-xs text-white/40">{label}</p>
    </div>
  );
}