import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function getDayRange(dateStr: string | null) {
  const base = dateStr ? new Date(dateStr) : new Date();

  const start = new Date(
    base.getFullYear(),
    base.getMonth(),
    base.getDate()
  );

  const end = new Date(
    base.getFullYear(),
    base.getMonth(),
    base.getDate() + 1
  );

  return { start, end };
}

// GET /api/nutrition/entries?date=2026-08-19
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
    const dateParam = searchParams.get("date");

    const { start, end } = getDayRange(dateParam);

    const entries = await prisma.nutritionEntry.findMany({
      where: {
        userId: user.id,
        date: {
          gte: start,
          lt: end,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(entries);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch entries" },
      { status: 500 }
    );
  }
}

// POST /api/nutrition/entries
// { date, foodName, calories, protein, carbs, fats }
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
    const { date, foodName, calories, protein, carbs, fats } = body;

    if (!foodName?.trim()) {
      return NextResponse.json(
        { error: "foodName is required" },
        { status: 400 }
      );
    }

    const numericFields = { calories, protein, carbs, fats };

    for (const [key, value] of Object.entries(numericFields)) {
      if (
        typeof value !== "number" ||
        !Number.isFinite(value) ||
        value < 0
      ) {
        return NextResponse.json(
          { error: `${key} must be a non-negative number` },
          { status: 400 }
        );
      }
    }

    const entry = await prisma.nutritionEntry.create({
      data: {
        userId: user.id,
        date: date ? new Date(date) : new Date(),
        foodName: foodName.trim(),
        calories,
        protein,
        carbs,
        fats,
      },
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create entry" },
      { status: 500 }
    );
  }
}