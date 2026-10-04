import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/nutrition/target
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

    const target = await prisma.nutritionTarget.findUnique({
      where: {
        userId: user.id,
      },
    });

    return NextResponse.json(target);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch target" },
      { status: 500 }
    );
  }
}

// POST /api/nutrition/target  { calories, protein, carbs, fats }
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
    const { calories, protein, carbs, fats } = body;

    const values = { calories, protein, carbs, fats };

    for (const [key, value] of Object.entries(values)) {
      if (
        typeof value !== "number" ||
        !Number.isFinite(value) ||
        value <= 0
      ) {
        return NextResponse.json(
          { error: `${key} must be a positive number` },
          { status: 400 }
        );
      }
    }

    const target = await prisma.nutritionTarget.upsert({
      where: {
        userId: user.id,
      },
      create: {
        userId: user.id,
        calories,
        protein,
        carbs,
        fats,
      },
      update: {
        calories,
        protein,
        carbs,
        fats,
      },
    });

    return NextResponse.json(target);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to save target" },
      { status: 500 }
    );
  }
}