import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{
    workoutId: string;
    exerciseId: string;
  }>;
}

// ========================================
// PATCH EXERCISE
// ========================================

export async function PATCH(
  req: Request,
  { params }: RouteParams
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { workoutId, exerciseId } =
      await params;

    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Workout bu user-ə aiddir?
    const workout =
      await prisma.workout.findFirst({
        where: {
          id: workoutId,
          userId: user.id,
        },
      });

    if (!workout) {
      return NextResponse.json(
        { error: "Workout not found" },
        { status: 404 }
      );
    }

    // Exercise bu workout-a aiddir?
    const exercise =
      await prisma.workoutExercise.findFirst({
        where: {
          id: exerciseId,
          workoutId: workout.id,
        },
      });

    if (!exercise) {
      return NextResponse.json(
        { error: "Exercise not found" },
        { status: 404 }
      );
    }

    const body = await req.json();

    const data: {
      name?: string;
      sets?: number | null;
      reps?: number | null;
      completed?: boolean;
    } = {};

    // NAME
    if (body.name !== undefined) {
      const name =
        typeof body.name === "string"
          ? body.name.trim()
          : "";

      if (!name) {
        return NextResponse.json(
          {
            error:
              "Exercise name cannot be empty",
          },
          { status: 400 }
        );
      }

      data.name = name;
    }

    // SETS
    if (body.sets !== undefined) {
      data.sets =
        body.sets === null ||
        body.sets === ""
          ? null
          : Number(body.sets);
    }

    // REPS
    if (body.reps !== undefined) {
      data.reps =
        body.reps === null ||
        body.reps === ""
          ? null
          : Number(body.reps);
    }

    // COMPLETED
    if (body.completed !== undefined) {
      data.completed = Boolean(
        body.completed
      );
    }

    const updatedExercise =
      await prisma.workoutExercise.update({
        where: {
          id: exercise.id,
        },
        data,
      });

    return NextResponse.json(
      updatedExercise
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to update exercise" },
      { status: 500 }
    );
  }
}

// ========================================
// DELETE EXERCISE
// ========================================

export async function DELETE(
  req: Request,
  { params }: RouteParams
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { workoutId, exerciseId } =
      await params;

    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Workout bu user-ə aiddir?
    const workout =
      await prisma.workout.findFirst({
        where: {
          id: workoutId,
          userId: user.id,
        },
      });

    if (!workout) {
      return NextResponse.json(
        { error: "Workout not found" },
        { status: 404 }
      );
    }

    // Exercise bu workout-a aiddir?
    const exercise =
      await prisma.workoutExercise.findFirst({
        where: {
          id: exerciseId,
          workoutId: workout.id,
        },
      });

    if (!exercise) {
      return NextResponse.json(
        { error: "Exercise not found" },
        { status: 404 }
      );
    }

    await prisma.workoutExercise.delete({
      where: {
        id: exercise.id,
      },
    });

    return NextResponse.json({
      message: "Exercise deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to delete exercise" },
      { status: 500 }
    );
  }
}