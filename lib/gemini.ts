import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not configured");
}

const ai = new GoogleGenAI({
  apiKey,
});

export interface NutritionAnalysis {
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export async function analyzeFood(
  foodDescription: string
): Promise<NutritionAnalysis> {
  const prompt = `
You are a nutrition estimation assistant.

Analyze the food described by the user and estimate its nutritional values.

User input:
"${foodDescription}"

Return approximate values for:
- calories in kcal
- protein in grams
- carbohydrates in grams
- fats in grams

Important rules:
- Use the quantity provided by the user.
- If quantity is missing, make a reasonable standard serving assumption.
- These are estimates, not exact laboratory measurements.
- Do not provide medical advice.
- Return ONLY JSON matching the requested schema.
`;

  const response = await ai.models.generateContent({
   model: "gemini-3.6-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          foodName: {
            type: "string",
            description:
              "Short name describing the analyzed food",
          },

          calories: {
            type: "number",
            description:
              "Estimated calories in kcal",
          },

          protein: {
            type: "number",
            description:
              "Estimated protein in grams",
          },

          carbs: {
            type: "number",
            description:
              "Estimated carbohydrates in grams",
          },

          fats: {
            type: "number",
            description:
              "Estimated fats in grams",
          },
        },

        required: [
          "foodName",
          "calories",
          "protein",
          "carbs",
          "fats",
        ],
      },
    },
  });

  if (!response.text) {
    throw new Error(
      "Gemini returned an empty response"
    );
  }

  const result = JSON.parse(
    response.text
  ) as NutritionAnalysis;

  return result;
}