import { GoogleGenAI } from "@google/genai";

// Açar yoxlaması və client yaratmaq funksiyanın içindədir,
// yalnız Gemini həqiqətən çağırılanda işləyir.
let client: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
  if (client) return client;

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  client = new GoogleGenAI({ apiKey });
  return client;
}

// Gemini müvəqqəti məşğul olanda atılır, route buna görə düzgün mesaj göstərir
export class AIBusyError extends Error {
  constructor() {
    super("AI service is temporarily busy");
    this.name = "AIBusyError";
  }
}

const PRIMARY_MODEL = "gemini-3.6-flash";
const MAX_ATTEMPTS = 2;

// 503 = model yüklənib, 429 = limit aşılıb. İkisi də bir az sonra keçə bilər.
function isTemporaryError(error: unknown): boolean {
  const status = (error as { status?: number } | null)?.status;
  return status === 503 || status === 429;
}

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export interface NutritionAnalysis {
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

// Bir modelə sorğu göndərir, müvəqqəti xətada qısa gözləyib təkrar cəhd edir
async function generateWithRetry(
  ai: GoogleGenAI,
  model: string,
  prompt: string
) {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      return await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              foodName: {
                type: "string",
                description: "Short name describing the analyzed food",
              },
              calories: {
                type: "number",
                description: "Estimated calories in kcal",
              },
              protein: {
                type: "number",
                description: "Estimated protein in grams",
              },
              carbs: {
                type: "number",
                description: "Estimated carbohydrates in grams",
              },
              fats: {
                type: "number",
                description: "Estimated fats in grams",
              },
            },
            required: ["foodName", "calories", "protein", "carbs", "fats"],
          },
        },
      });
    } catch (error) {
      const isLastAttempt = attempt === MAX_ATTEMPTS;

      if (!isTemporaryError(error) || isLastAttempt) {
        throw error;
      }

      await sleep(1000 * attempt);
    }
  }

  throw new Error("Unreachable");
}

export async function analyzeFood(
  foodDescription: string
): Promise<NutritionAnalysis> {
  const ai = getAI();

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

  // Əsas model, sonra (varsa) ehtiyat model
  const models = [PRIMARY_MODEL, process.env.GEMINI_FALLBACK_MODEL].filter(
    (m): m is string => Boolean(m)
  );

  let response: Awaited<ReturnType<typeof generateWithRetry>> | undefined;

  for (const model of models) {
    try {
      response = await generateWithRetry(ai, model, prompt);
      break;
    } catch (error) {
      // Müvəqqəti xəta deyilsə (səhv açar və s.), ehtiyat modelin mənası yoxdur
      if (!isTemporaryError(error)) {
        throw error;
      }
    }
  }

  if (!response) {
    throw new AIBusyError();
  }

  if (!response.text) {
    throw new Error("Gemini returned an empty response");
  }

  const result = JSON.parse(response.text) as NutritionAnalysis;

  return result;
}