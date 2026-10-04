import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ exerciseId: string }>;
}

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

    const exercise = await prisma.exercise.findUnique({
      where: {
        id: exerciseId,
      },
      include: {
        userExercises: {
          where: {
            userId: user.id,
          },
          select: {
            id: true,
          },
        },
        ratings: {
          where: {
            userId: user.id,
          },
          select: {
            value: true,
          },
        },
      },
    });

    if (!exercise) {
      return NextResponse.json(
        { error: "Exercise not found" },
        { status: 404 }
      );
    }

    const { userExercises, ratings, ...rest } = exercise;

    return NextResponse.json({
      ...rest,
      isFavorited: userExercises.length > 0,
      userRating: ratings[0]?.value ?? null,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch exercise" },
      { status: 500 }
    );
  }
}