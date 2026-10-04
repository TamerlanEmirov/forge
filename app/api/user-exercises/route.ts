import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/user-exercises  { exerciseId }
// Toggle: yoxdursa yaradır (favorite), varsa silir (unfavorite)
export async function POST(req: Request) {
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

    const body = await req.json();
    const { exerciseId } = body;

    if (!exerciseId) {
      return NextResponse.json(
        { error: "exerciseId is required" },
        { status: 400 }
      );
    }

    const existing = await prisma.userExercise.findUnique({
      where: {
        userId_exerciseId: {
          userId: user.id,
          exerciseId,
        },
      },
    });

    if (existing) {
      await prisma.userExercise.delete({
        where: {
          id: existing.id,
        },
      });

      return NextResponse.json({ isFavorited: false });
    }

    await prisma.userExercise.create({
      data: {
        userId: user.id,
        exerciseId,
      },
    });

    return NextResponse.json(
      { isFavorited: true },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to toggle favorite" },
      { status: 500 }
    );
  }
}