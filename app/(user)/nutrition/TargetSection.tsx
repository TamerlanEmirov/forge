"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Beef, Droplets, Flame, Pencil, Wheat } from "lucide-react";

import type { NutritionTarget } from "@/types/nutrition";

const DEFAULT_FORM = {
  calories: "2500",
  protein: "150",
  carbs: "250",
  fats: "70",
};

export function TargetSection() {
  const [target, setTarget] = useState<NutritionTarget | null>(null);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(DEFAULT_FORM);

  useEffect(() => {
    async function fetchTarget() {
      try {
        setLoading(true);

        const response = await fetch("/api/nutrition/target");

        if (!response.ok) {
          throw new Error("Failed to fetch target");
        }

        const data: NutritionTarget | null =
          await response.json();

        setTarget(data);

        if (data) {
          setForm({
            calories: String(data.calories),
            protein: String(data.protein),
            carbs: String(data.carbs),
            fats: String(data.fats),
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchTarget();
  }, []);

  function openForm() {
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);

    if (target) {
      setForm({
        calories: String(target.calories),
        protein: String(target.protein),
        carbs: String(target.carbs),
        fats: String(target.fats),
      });
    }
  }

  async function handleSave() {
    const payload = {
      calories: Number(form.calories),
      protein: Number(form.protein),
      carbs: Number(form.carbs),
      fats: Number(form.fats),
    };

    const invalid = Object.values(payload).some(
      (value) => !Number.isFinite(value) || value <= 0
    );

    if (invalid) return;

    try {
      setSaving(true);

      const response = await fetch(
        "/api/nutrition/target",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save target");
      }

      const data: NutritionTarget = await response.json();

      setTarget(data);
      setFormOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#151515] p-6">
        <p className="text-sm text-white/40">Loading...</p>
      </div>
    );
  }

  // NO TARGET YET

  if (!target && !formOpen) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-white/15 bg-[#151515] p-8 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#C6FF00]/10">
          <Flame className="h-6 w-6 text-[#C6FF00]" />
        </span>

        <h2 className="mt-4 text-lg font-semibold text-white">
          Set your nutrition target
        </h2>

        <p className="mt-1 max-w-xs text-sm text-white/40">
          Add a daily calorie and macro goal to start tracking
          progress.
        </p>

        <button
          type="button"
          onClick={openForm}
          className="mt-5 rounded-lg bg-[#C6FF00] px-5 py-2.5 text-sm font-medium text-black transition-opacity hover:opacity-90"
        >
          Set Target
        </button>
      </div>
    );
  }

  // FORM (create or edit)

  if (formOpen) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#151515] p-6">
        <h2 className="text-lg font-semibold text-white">
          {target ? "Edit Target" : "Set Target"}
        </h2>

        <div className="mt-5 grid grid-cols-2 gap-4">
          <FormField
            label="Calories (kcal)"
            value={form.calories}
            onChange={(value) =>
              setForm((prev) => ({ ...prev, calories: value }))
            }
          />

          <FormField
            label="Protein (g)"
            value={form.protein}
            onChange={(value) =>
              setForm((prev) => ({ ...prev, protein: value }))
            }
          />

          <FormField
            label="Carbs (g)"
            value={form.carbs}
            onChange={(value) =>
              setForm((prev) => ({ ...prev, carbs: value }))
            }
          />

          <FormField
            label="Fats (g)"
            value={form.fats}
            onChange={(value) =>
              setForm((prev) => ({ ...prev, fats: value }))
            }
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={closeForm}
            className="px-4 py-2 text-sm text-white/50 transition-colors hover:text-white"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-[#C6FF00] px-5 py-2.5 text-sm font-medium text-black transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {saving ? "Saving..." : "Save Target"}
          </button>
        </div>
      </div>
    );
  }

  if (!target) return null;

  // TARGET DISPLAY

  return (
    <div className="rounded-2xl border border-white/10 bg-[#151515] p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">
          Daily Target
        </h2>

        <button
          type="button"
          onClick={openForm}
          className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-xs font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-white"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </button>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatBlock
          icon={<Flame className="h-4 w-4" />}
          label="Calories"
          value={target.calories}
          unit="kcal"
        />

        <StatBlock
          icon={<Beef className="h-4 w-4" />}
          label="Protein"
          value={target.protein}
          unit="g"
        />

        <StatBlock
          icon={<Wheat className="h-4 w-4" />}
          label="Carbs"
          value={target.carbs}
          unit="g"
        />

        <StatBlock
          icon={<Droplets className="h-4 w-4" />}
          label="Fats"
          value={target.fats}
          unit="g"
        />
      </div>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-white/50">
        {label}
      </label>

      <input
        type="number"
        min="1"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-[#C6FF00]/50"
      />
    </div>
  );
}

function StatBlock({
  icon,
  label,
  value,
  unit,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  unit: string;
}) {
  return (
    <div className="rounded-xl bg-white/5 p-3.5">
      <div className="flex items-center gap-1.5 text-[#C6FF00]">
        {icon}
        <span className="text-xs font-medium text-white/50">
          {label}
        </span>
      </div>

      <p className="mt-2 text-lg font-semibold text-white">
        {value}
        <span className="ml-1 text-xs font-normal text-white/40">
          {unit}
        </span>
      </p>
    </div>
  );
}