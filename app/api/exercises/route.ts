import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/exercises?q=&muscleGroup=&favoritesOnly=true
export async function GET(req: Request) {
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

    const { searchParams } = new URL(req.url);

    const q = searchParams.get("q")?.trim() ?? "";
    const muscleGroup =
      searchParams.get("muscleGroup")?.trim() ?? "";
    const favoritesOnly =
      searchParams.get("favoritesOnly") === "true";

    const exercises = await prisma.exercise.findMany({
      where: {
        AND: [
          q
            ? {
                OR: [
                  {
                    name: {
                      contains: q,
                      mode: "insensitive",
                    },
                  },
                  {
                    muscleGroup: {
                      contains: q,
                      mode: "insensitive",
                    },
                  },
                ],
              }
            : {},
          muscleGroup
            ? {
                muscleGroup: {
                  equals: muscleGroup,
                  mode: "insensitive",
                },
              }
            : {},
          favoritesOnly
            ? {
                userExercises: {
                  some: {
                    userId: user.id,
                  },
                },
              }
            : {},
        ],
      },
      orderBy: {
        name: "asc",
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
      },
    });

    const result = exercises.map((exercise) => {
      const { userExercises, ...rest } = exercise;

      return {
        ...rest,
        isFavorited: userExercises.length > 0,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch exercises" },
      { status: 500 }
    );
  }
}