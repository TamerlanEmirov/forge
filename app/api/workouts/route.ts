import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
export async function GET() {
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

    const workouts = await prisma.workout.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        date: "asc",
      },
      include: {
        exercises: {
          select: {
            completed: true,
          },
        },
      },
    });

    return NextResponse.json(workouts);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch workouts" },
      { status: 500 }
    );
  }
}

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

    const { name, date } = body;

    if (!name || !date) {
      return NextResponse.json(
        { error: "Name and date are required" },
        { status: 400 }
      );
    }

    const workout = await prisma.workout.create({
      data: {
        name,
        date: new Date(date),
        userId: user.id,
      },
    });

    return NextResponse.json(workout, {
      status: 201,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create workout" },
      { status: 500 }
    );
  }
}