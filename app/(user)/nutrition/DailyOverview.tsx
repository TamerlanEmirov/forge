"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

import { CalorieRing } from "./CalorieRing";

import type { NutritionTarget } from "@/types/nutrition";

interface Totals {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface DailyOverviewProps {
  target: NutritionTarget | null;
  totals: Totals;
  onSaveTarget: (payload: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  }) => Promise<void>;
}

const DEFAULT_FORM = {
  calories: "2500",
  protein: "150",
  carbs: "250",
  fats: "70",
};

export function DailyOverview({
  target,
  totals,
  onSaveTarget,
}: DailyOverviewProps) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(
    target
      ? {
          calories: String(target.calories),
          protein: String(target.protein),
          carbs: String(target.carbs),
          fats: String(target.fats),
        }
      : DEFAULT_FORM
  );

  function openEdit() {
    setForm(
      target
        ? {
            calories: String(target.calories),
            protein: String(target.protein),
            carbs: String(target.carbs),
            fats: String(target.fats),
          }
        : DEFAULT_FORM
    );
    setEditing(true);
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
      await onSaveTarget(payload);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#151515] p-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Daily Overview
          </h1>

          <p className="mt-1.5 text-base text-white/40">
            Track your intake to reach your performance goals.
          </p>
        </div>

        {target && !editing && (
          <button
            type="button"
            onClick={openEdit}
            aria-label="Edit target"
            className="rounded-full p-2 text-white/30 transition-colors hover:text-white"
          >
            <Pencil className="h-5 w-5" />
          </button>
        )}
      </div>

      {!target && !editing ? (
        <div className="mt-10 flex flex-col items-center text-center">
          <p className="text-sm text-white/40">
            Set a daily calorie and macro target to start tracking.
          </p>

          <button
            type="button"
            onClick={openEdit}
            className="mt-4 rounded-lg bg-[#C6FF00] px-6 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90"
          >
            Set Target
          </button>
        </div>
      ) : editing ? (
        <div className="mt-8 grid grid-cols-2 gap-5">
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

          <div className="col-span-2 flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="px-4 py-2.5 text-sm text-white/50 transition-colors hover:text-white"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-[#C6FF00] px-6 py-2.5 text-sm font-medium text-black transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              {saving ? "Saving..." : "Save Target"}
            </button>
          </div>
        </div>
      ) : (
        target && (
          <>
            <div className="mt-4 flex flex-col items-center">
              <span className="mb-4 self-start text-xs font-medium tracking-wider text-white/40">
                TOTAL CALORIES
              </span>

              <CalorieRing
                consumed={totals.calories}
                target={target.calories}
              />
            </div>

            <div className="mt-10 space-y-6">
              <MacroBar
                label="PROTEIN"
                consumed={totals.protein}
                target={target.protein}
                colorClass="bg-[#C6FF00]"
              />

              <MacroBar
                label="CARBS"
                consumed={totals.carbs}
                target={target.carbs}
              />

              <MacroBar
                label="FATS"
                consumed={totals.fats}
                target={target.fats}
              />
            </div>
          </>
        )
      )}
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
      <label className="mb-2 block text-xs font-medium text-white/50">
        {label}
      </label>

      <input
        type="number"
        min="1"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-[#C6FF00]/50"
      />
    </div>
  );
}

function MacroBar({
  label,
  consumed,
  target,
  colorClass = "bg-white",
}: {
  label: string;
  consumed: number;
  target: number;
  colorClass?: string;
}) {
  const ratio = target > 0 ? Math.min(consumed / target, 1) : 0;

  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium tracking-wider text-white/40">
          {label}
        </span>

        <span className="text-white/70">
          {Math.round(consumed)}{" "}
          <span className="text-white/30">
            / {Math.round(target)}g
          </span>
        </span>
      </div>

      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full ${colorClass}`}
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
    </div>
  );
}