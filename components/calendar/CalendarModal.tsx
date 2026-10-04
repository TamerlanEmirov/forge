"use client";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { ProgressBar } from "./ProgressBar";

import type {
  Workout,
  WorkoutExercise,
} from "@/types/workout";

interface CalendarModalProps {
  workout: Workout | null;
  date: Date | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExerciseAdded?: (
    exercise: WorkoutExercise
  ) => void;
}

export function CalendarModal({
  workout,
  date,
  open,
  onOpenChange,
  onExerciseAdded,
}: CalendarModalProps) {
  const [exercises, setExercises] = useState<
    WorkoutExercise[]
  >([]);

  const [exerciseName, setExerciseName] =
    useState("");

  const [sets, setSets] = useState("");

  const [reps, setReps] = useState("");

  const [isAdding, setIsAdding] =
    useState(false);

  // ========================================
  // EDIT STATE
  // ========================================

  const [editingExerciseId, setEditingExerciseId] =
    useState<string | null>(null);

  const [editName, setEditName] =
    useState("");

  const [editSets, setEditSets] =
    useState("");

  const [editReps, setEditReps] =
    useState("");

  const [isSavingEdit, setIsSavingEdit] =
    useState(false);

  const [deletingExerciseId, setDeletingExerciseId] =
    useState<string | null>(null);

  // ========================================
  // GET EXERCISES
  // ========================================

  useEffect(() => {
    if (!open || !workout) return;

    setExercises([]);

    const workoutId = workout.id;

    async function loadExercises() {
      try {
        const response = await fetch(
          `/api/workouts/${workoutId}/exercises`
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch exercises"
          );
        }

        const data: WorkoutExercise[] =
          await response.json();

        setExercises(data);
      } catch (error) {
        console.error(error);
      }
    }

    loadExercises();
  }, [open, workout?.id]);

  // ========================================
  // TOGGLE EXERCISE
  // ========================================

  async function handleToggleExercise(
    exercise: WorkoutExercise
  ) {
    if (!workout) return;

    const newCompleted =
      !exercise.completed;

    setExercises((prev) =>
      prev.map((item) =>
        item.id === exercise.id
          ? {
              ...item,
              completed: newCompleted,
            }
          : item
      )
    );

    try {
      const response = await fetch(
        `/api/workouts/${workout.id}/exercises/${exercise.id}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            completed: newCompleted,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to update exercise"
        );
      }
    } catch (error) {
      console.error(error);

      setExercises((prev) =>
        prev.map((item) =>
          item.id === exercise.id
            ? {
                ...item,
                completed:
                  exercise.completed,
              }
            : item
        )
      );
    }
  }

  // ========================================
  // START EDIT
  // ========================================

  function handleStartEdit(
    exercise: WorkoutExercise
  ) {
    setEditingExerciseId(exercise.id);

    setEditName(exercise.name);

    setEditSets(
      exercise.sets !== null &&
        exercise.sets !== undefined
        ? String(exercise.sets)
        : ""
    );

    setEditReps(
      exercise.reps !== null &&
        exercise.reps !== undefined
        ? String(exercise.reps)
        : ""
    );
  }

  // ========================================
  // CANCEL EDIT
  // ========================================

  function handleCancelEdit() {
    setEditingExerciseId(null);
    setEditName("");
    setEditSets("");
    setEditReps("");
  }

  // ========================================
  // SAVE EDIT
  // ========================================

  async function handleSaveEdit(
    exercise: WorkoutExercise
  ) {
    if (
      !workout ||
      !editName.trim()
    ) {
      return;
    }

    try {
      setIsSavingEdit(true);

      const response = await fetch(
        `/api/workouts/${workout.id}/exercises/${exercise.id}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name: editName.trim(),

            sets: editSets
              ? Number(editSets)
              : null,

            reps: editReps
              ? Number(editReps)
              : null,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to update exercise"
        );
      }

      const updatedExercise: WorkoutExercise =
        await response.json();

      setExercises((prev) =>
        prev.map((item) =>
          item.id === exercise.id
            ? updatedExercise
            : item
        )
      );

      handleCancelEdit();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSavingEdit(false);
    }
  }

  // ========================================
  // DELETE EXERCISE
  // ========================================

  async function handleDeleteExercise(
    exercise: WorkoutExercise
  ) {
    if (!workout) return;

    const confirmed = window.confirm(
      `Delete "${exercise.name}"?`
    );

    if (!confirmed) return;

    try {
      setDeletingExerciseId(
        exercise.id
      );

      const response = await fetch(
        `/api/workouts/${workout.id}/exercises/${exercise.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to delete exercise"
        );
      }

      setExercises((prev) =>
        prev.filter(
          (item) =>
            item.id !== exercise.id
        )
      );

      if (
        editingExerciseId ===
        exercise.id
      ) {
        handleCancelEdit();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setDeletingExerciseId(null);
    }
  }

  // ========================================
  // ADD EXERCISE
  // ========================================

  async function handleAddExercise() {
    if (
      !workout ||
      !exerciseName.trim()
    ) {
      return;
    }

    try {
      setIsAdding(true);

      const response = await fetch(
        `/api/workouts/${workout.id}/exercises`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name: exerciseName.trim(),

            sets: sets
              ? Number(sets)
              : null,

            reps: reps
              ? Number(reps)
              : null,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to add exercise"
        );
      }

      const newExercise: WorkoutExercise =
        await response.json();

      setExercises((prev) => [
        ...prev,
        newExercise,
      ]);

      onExerciseAdded?.(
        newExercise
      );

      setExerciseName("");
      setSets("");
      setReps("");
    } catch (error) {
      console.error(error);
    } finally {
      setIsAdding(false);
    }
  }

  // ========================================
  // PROGRESS
  // ========================================

  const completedExercises =
    exercises.filter(
      (exercise) =>
        exercise.completed
    ).length;

  const totalExercises =
    exercises.length;

  const progress =
    totalExercises > 0
      ? Math.round(
          (completedExercises /
            totalExercises) *
            100
        )
      : 0;

  // ========================================
  // RENDER
  // ========================================

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent
        className="
          max-h-[90vh]
          overflow-y-auto
          border-white/10
          bg-[#0F0F0F]
          p-0
          text-white
          shadow-2xl
          shadow-black/50
          sm:max-w-2xl
        "
      >
        {/* =================================
            HEADER
        ================================== */}

        <div className="border-b border-white/10 px-6 pb-5 pt-6">
          <DialogHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#C6FF00] shadow-[0_0_10px_#C6FF00]" />

                  <span className="text-xs font-medium uppercase tracking-[0.15em] text-[#C6FF00]">
                    Workout
                  </span>
                </div>

                <DialogTitle className="text-2xl font-semibold tracking-tight text-white">
                  {workout?.name}
                </DialogTitle>

                <DialogDescription className="mt-1 text-sm text-white/40">
                  {date?.toLocaleDateString(
                    undefined,
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </DialogDescription>
              </div>

              <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl border border-[#C6FF00]/20 bg-[#C6FF00]/10">
                <span className="text-lg font-semibold text-[#C6FF00]">
                  {progress}%
                </span>

                <span className="text-[9px] uppercase tracking-wider text-[#C6FF00]/50">
                  done
                </span>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* =================================
            CONTENT
        ================================== */}

        <div className="space-y-7 px-6 py-6">

          {/* =================================
              PROGRESS
          ================================== */}

          <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">
                  Workout Progress
                </p>

                <p className="mt-1 text-xs text-white/35">
                  Keep going and finish your workout.
                </p>
              </div>

              <span className="text-sm font-medium text-[#C6FF00]">
                {completedExercises}/
                {totalExercises}
              </span>
            </div>

            <ProgressBar
              completed={
                completedExercises
              }
              total={totalExercises}
            />
          </section>

          {/* =================================
              EXERCISES
          ================================== */}

          <section>
            <div className="mb-4 flex items-end justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Exercises
                </h2>

                <p className="mt-1 text-xs text-white/35">
                  Complete, edit or remove your exercises.
                </p>
              </div>

              <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1">
                <span className="text-xs text-white/50">
                  {totalExercises}{" "}
                  {totalExercises === 1
                    ? "exercise"
                    : "exercises"}
                </span>
              </div>
            </div>

            {/* EMPTY */}

            {exercises.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-10 text-center">
                <div className="mx-auto mb-3 flex size-11 items-center justify-center rounded-xl bg-[#C6FF00]/10">
                  <span className="text-xl text-[#C6FF00]">
                    +
                  </span>
                </div>

                <p className="text-sm font-medium text-white/70">
                  No exercises yet
                </p>

                <p className="mt-1 text-xs text-white/30">
                  Add your first exercise below.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {exercises.map(
                  (exercise, index) => {
                    const isEditing =
                      editingExerciseId ===
                      exercise.id;

                    const isDeleting =
                      deletingExerciseId ===
                      exercise.id;

                    return (
                      <div
                        key={exercise.id}
                        className={`
                          rounded-2xl
                          border
                          p-4
                          transition-all
                          duration-200
                          ${
                            exercise.completed
                              ? "border-[#C6FF00]/15 bg-[#C6FF00]/[0.045]"
                              : "border-white/10 bg-white/[0.02]"
                          }
                        `}
                      >
                        {/* =========================
                            NORMAL VIEW
                        ========================== */}

                        {!isEditing ? (
                          <div className="flex items-center justify-between gap-4">

                            {/* LEFT */}

                            <div className="flex min-w-0 items-center gap-3">

                              {/* CHECK */}

                              <button
                                type="button"
                                onClick={() =>
                                  handleToggleExercise(
                                    exercise
                                  )
                                }
                                aria-label={
                                  exercise.completed
                                    ? "Mark exercise incomplete"
                                    : "Mark exercise complete"
                                }
                                className={`
                                  flex
                                  size-7
                                  shrink-0
                                  items-center
                                  justify-center
                                  rounded-lg
                                  border
                                  transition-all
                                  ${
                                    exercise.completed
                                      ? "border-[#C6FF00] bg-[#C6FF00] text-black"
                                      : "border-white/15 bg-white/[0.02] text-transparent hover:border-[#C6FF00]/50 hover:bg-[#C6FF00]/5"
                                  }
                                `}
                              >
                                {exercise.completed && (
                                  <span className="text-sm font-bold">
                                    ✓
                                  </span>
                                )}
                              </button>

                              {/* NUMBER */}

                              <div
                                className={`
                                  flex
                                  size-8
                                  shrink-0
                                  items-center
                                  justify-center
                                  rounded-lg
                                  text-xs
                                  font-medium
                                  ${
                                    exercise.completed
                                      ? "bg-[#C6FF00]/10 text-[#C6FF00]"
                                      : "bg-white/[0.05] text-white/30"
                                  }
                                `}
                              >
                                {String(
                                  index + 1
                                ).padStart(
                                  2,
                                  "0"
                                )}
                              </div>

                              {/* INFO */}

                              <div className="min-w-0">
                                <p
                                  className={`
                                    truncate
                                    text-sm
                                    font-medium
                                    ${
                                      exercise.completed
                                        ? "text-white/35 line-through"
                                        : "text-white"
                                    }
                                  `}
                                >
                                  {exercise.name}
                                </p>

                                <p className="mt-0.5 text-[11px] text-white/30">
                                  {exercise.sets ??
                                    "-"}{" "}
                                  sets ×{" "}
                                  {exercise.reps ??
                                    "-"}{" "}
                                  reps
                                </p>
                              </div>
                            </div>

                            {/* RIGHT */}

                            <div className="flex shrink-0 items-center gap-2">

                              {/* STATUS */}

                              <div
                                className={`
                                  hidden
                                  rounded-lg
                                  px-2.5
                                  py-1.5
                                  text-xs
                                  sm:block
                                  ${
                                    exercise.completed
                                      ? "bg-[#C6FF00]/10 text-[#C6FF00]"
                                      : "bg-white/[0.04] text-white/35"
                                  }
                                `}
                              >
                                {exercise.completed
                                  ? "Completed"
                                  : "Pending"}
                              </div>

                              {/* EDIT */}

                              <button
                                type="button"
                                onClick={() =>
                                  handleStartEdit(
                                    exercise
                                  )
                                }
                                className="
                                  rounded-lg
                                  border
                                  border-white/10
                                  bg-white/[0.03]
                                  px-3
                                  py-1.5
                                  text-xs
                                  text-white/45
                                  transition
                                  hover:border-[#C6FF00]/30
                                  hover:bg-[#C6FF00]/5
                                  hover:text-[#C6FF00]
                                "
                              >
                                Edit
                              </button>

                              {/* DELETE */}

                              <button
                                type="button"
                                disabled={
                                  isDeleting
                                }
                                onClick={() =>
                                  handleDeleteExercise(
                                    exercise
                                  )
                                }
                                className="
                                  rounded-lg
                                  border
                                  border-red-500/10
                                  bg-red-500/[0.03]
                                  px-3
                                  py-1.5
                                  text-xs
                                  text-red-400/60
                                  transition
                                  hover:border-red-500/30
                                  hover:bg-red-500/10
                                  hover:text-red-400
                                  disabled:cursor-not-allowed
                                  disabled:opacity-40
                                "
                              >
                                {isDeleting
                                  ? "..."
                                  : "Delete"}
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* =========================
                             EDIT VIEW
                          ========================== */

                          <div className="space-y-4">

                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-[#C6FF00]">
                                  Edit Exercise
                                </p>

                                <p className="mt-1 text-xs text-white/30">
                                  Update exercise details.
                                </p>
                              </div>

                              <span className="text-xs text-white/25">
                                #{String(
                                  index + 1
                                ).padStart(
                                  2,
                                  "0"
                                )}
                              </span>
                            </div>

                            {/* NAME */}

                            <div>
                              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/40">
                                Exercise name
                              </label>

                              <Input
                                value={
                                  editName
                                }
                                onChange={(
                                  event
                                ) =>
                                  setEditName(
                                    event
                                      .target
                                      .value
                                  )
                                }
                                className="
                                  border-white/10
                                  bg-white/[0.04]
                                  text-white
                                  placeholder:text-white/25
                                  focus-visible:border-[#C6FF00]/50
                                  focus-visible:ring-[#C6FF00]/20
                                "
                              />
                            </div>

                            {/* SETS + REPS */}

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/40">
                                  Sets
                                </label>

                                <Input
                                  type="number"
                                  min="1"
                                  value={
                                    editSets
                                  }
                                  onChange={(
                                    event
                                  ) =>
                                    setEditSets(
                                      event
                                        .target
                                        .value
                                    )
                                  }
                                  className="
                                    border-white/10
                                    bg-white/[0.04]
                                    text-white
                                    focus-visible:border-[#C6FF00]/50
                                    focus-visible:ring-[#C6FF00]/20
                                  "
                                />
                              </div>

                              <div>
                                <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/40">
                                  Reps
                                </label>

                                <Input
                                  type="number"
                                  min="1"
                                  value={
                                    editReps
                                  }
                                  onChange={(
                                    event
                                  ) =>
                                    setEditReps(
                                      event
                                        .target
                                        .value
                                    )
                                  }
                                  className="
                                    border-white/10
                                    bg-white/[0.04]
                                    text-white
                                    focus-visible:border-[#C6FF00]/50
                                    focus-visible:ring-[#C6FF00]/20
                                  "
                                />
                              </div>
                            </div>

                            {/* BUTTONS */}

                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={
                                  handleCancelEdit
                                }
                                disabled={
                                  isSavingEdit
                                }
                                className="
                                  rounded-lg
                                  px-4
                                  py-2
                                  text-xs
                                  text-white/40
                                  transition
                                  hover:bg-white/5
                                  hover:text-white
                                "
                              >
                                Cancel
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleSaveEdit(
                                    exercise
                                  )
                                }
                                disabled={
                                  !editName.trim() ||
                                  isSavingEdit
                                }
                                className="
                                  rounded-lg
                                  bg-[#C6FF00]
                                  px-4
                                  py-2
                                  text-xs
                                  font-semibold
                                  text-black
                                  transition
                                  hover:bg-[#d4ff3d]
                                  disabled:cursor-not-allowed
                                  disabled:opacity-40
                                "
                              >
                                {isSavingEdit
                                  ? "Saving..."
                                  : "Save Changes"}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </section>

          {/* =================================
              ADD EXERCISE
          ================================== */}

          <section className="border-t border-white/10 pt-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-white">
                Add Exercise
              </h2>

              <p className="mt-1 text-xs text-white/35">
                Add another exercise to this workout.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
              <div className="space-y-4">

                {/* NAME */}

                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/40">
                    Exercise name
                  </label>

                  <Input
                    placeholder="e.g. Bench Press"
                    value={
                      exerciseName
                    }
                    onChange={(event) =>
                      setExerciseName(
                        event.target
                          .value
                      )
                    }
                    className="
                      border-white/10
                      bg-white/[0.04]
                      text-white
                      placeholder:text-white/25
                      focus-visible:border-[#C6FF00]/50
                      focus-visible:ring-[#C6FF00]/20
                    "
                  />
                </div>

                {/* SETS + REPS */}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/40">
                      Sets
                    </label>

                    <Input
                      type="number"
                      min="1"
                      placeholder="4"
                      value={sets}
                      onChange={(event) =>
                        setSets(
                          event.target
                            .value
                        )
                      }
                      className="
                        border-white/10
                        bg-white/[0.04]
                        text-white
                        placeholder:text-white/25
                        focus-visible:border-[#C6FF00]/50
                        focus-visible:ring-[#C6FF00]/20
                      "
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/40">
                      Reps
                    </label>

                    <Input
                      type="number"
                      min="1"
                      placeholder="8"
                      value={reps}
                      onChange={(event) =>
                        setReps(
                          event.target
                            .value
                        )
                      }
                      className="
                        border-white/10
                        bg-white/[0.04]
                        text-white
                        placeholder:text-white/25
                        focus-visible:border-[#C6FF00]/50
                        focus-visible:ring-[#C6FF00]/20
                      "
                    />
                  </div>
                </div>

                {/* ADD */}

                <Button
                  className="
                    h-11
                    w-full
                    bg-[#C6FF00]
                    font-semibold
                    text-black
                    transition-all
                    hover:bg-[#d4ff3d]
                    hover:shadow-[0_0_20px_rgba(198,255,0,0.12)]
                    disabled:opacity-40
                  "
                  disabled={
                    !exerciseName.trim() ||
                    isAdding
                  }
                  onClick={
                    handleAddExercise
                  }
                >
                  {isAdding
                    ? "Adding..."
                    : "+ Add Exercise"}
                </Button>
              </div>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}