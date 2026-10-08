import { NextResponse } from "next/server";

import { analyzeFood, AIBusyError } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const foodDescription = body.foodDescription;

    if (typeof foodDescription !== "string" || !foodDescription.trim()) {
      return NextResponse.json(
        { error: "Food description is required" },
        { status: 400 }
      );
    }

    const result = await analyzeFood(foodDescription.trim());

    return NextResponse.json(result);
  } catch (error) {
    // Əsl xəta yalnız serverin logunda qalır
    console.error("Nutrition analysis error:", error);

    // Gemini müvəqqəti məşğuldur: istifadəçiyə düzgün mesaj
    if (error instanceof AIBusyError) {
      return NextResponse.json(
        {
          error:
            "The AI service is busy right now. Please try again in a moment.",
        },
        { status: 503 }
      );
    }

    // Qalan hər şey: ümumi mesaj, daxili detallar istifadəçiyə getmir
    return NextResponse.json(
      { error: "Could not analyze this food. Please try again." },
      { status: 500 }
    );
  }
}