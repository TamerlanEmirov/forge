import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ exerciseId: string }>;
}

// POST /api/exercises/[exerciseId]/rating  { value: 0.5-5, 0.5 addımlarla }
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

    const { exerciseId } = await params;

    const body = await req.json();
    const { value } = body;

    const isValidHalfStep =
      typeof value === "number" &&
      value >= 0.5 &&
      value <= 5 &&
      Number.isInteger(value * 2);

    if (!isValidHalfStep) {
      return NextResponse.json(
        {
          error:
            "value must be between 0.5 and 5 in 0.5 increments",
        },
        { status: 400 }
      );
    }

    const exercise = await prisma.exercise.findUnique({
      where: {
        id: exerciseId,
      },
    });

    if (!exercise) {
      return NextResponse.json(
        { error: "Exercise not found" },
        { status: 404 }
      );
    }

    const updatedExercise = await prisma.$transaction(
      async (tx) => {
        await tx.rating.upsert({
          where: {
            userId_exerciseId: {
              userId: user.id,
              exerciseId,
            },
          },
          create: {
            userId: user.id,
            exerciseId,
            value,
          },
          update: {
            value,
          },
        });

        const aggregate = await tx.rating.aggregate({
          where: {
            exerciseId,
          },
          _avg: {
            value: true,
          },
          _count: {
            value: true,
          },
        });

        return tx.exercise.update({
          where: {
            id: exerciseId,
          },
          data: {
            averageRating: aggregate._avg.value ?? 0,
            ratingCount: aggregate._count.value,
          },
        });
      }
    );

    return NextResponse.json({
      averageRating: updatedExercise.averageRating,
      ratingCount: updatedExercise.ratingCount,
      userRating: value,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to submit rating" },
      { status: 500 }
    );
  }
}