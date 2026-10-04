import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{
    workoutId: string;
  }>;
}

// GET /api/workouts/[workoutId]/exercises
export async function GET(
  _req: Request,
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

    const { workoutId } = await params;

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

    const workout = await prisma.workout.findFirst({
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

    const exercises = await prisma.workoutExercise.findMany({
      where: {
        workoutId: workout.id,
      },
      orderBy: {
        order: "asc",
      },
    });

    return NextResponse.json(exercises);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch workout exercises" },
      { status: 500 }
    );
  }
}


// POST /api/workouts/[workoutId]/exercises
export async function POST(
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

    const { workoutId } = await params;

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

    const workout = await prisma.workout.findFirst({
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

    const body = await req.json();

    const {
      name,
      sets,
      reps,
    } = body;

    if (!name?.trim()) {
      return NextResponse.json(
        { error: "Exercise name is required" },
        { status: 400 }
      );
    }

    const lastExercise =
      await prisma.workoutExercise.findFirst({
        where: {
          workoutId: workout.id,
        },
        orderBy: {
          order: "desc",
        },
      });

    const nextOrder = lastExercise
      ? lastExercise.order + 1
      : 0;

    const exercise =
      await prisma.workoutExercise.create({
        data: {
          name: name.trim(),
          sets: sets ?? null,
          reps: reps ?? null,
          order: nextOrder,
          workoutId: workout.id,
        },
      });

    return NextResponse.json(
      exercise,
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create workout exercise" },
      { status: 500 }
    );
  }
}