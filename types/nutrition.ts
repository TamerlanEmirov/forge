export interface NutritionTarget {
  id: string;
  userId: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  createdAt: string;
  updatedAt: string;
}

export interface NutritionEntry {
  id: string;
  userId: string;
  date: string;
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  createdAt: string;
  updatedAt: string;
}