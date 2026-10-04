import { NextResponse } from "next/server";

import { analyzeFood } from "@/lib/gemini";

export async function POST(
  req: Request
) {
  try {
    const body = await req.json();

    const foodDescription =
      body.foodDescription;

    if (
      typeof foodDescription !== "string" ||
      !foodDescription.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "Food description is required",
        },
        { status: 400 }
      );
    }

    const result = await analyzeFood(
      foodDescription.trim()
    );

    return NextResponse.json(result);
 } catch (error) {
  console.error(
    "Nutrition analysis error:",
    error
  );

  return NextResponse.json(
    {
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    },
    { status: 500 }
  );
}
}