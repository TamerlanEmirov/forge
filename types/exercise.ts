export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  secondaryMuscles: string | null;
  equipment: string | null;
  description: string | null;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  averageRating: number;
  ratingCount: number;
  createdAt: string;
  updatedAt: string;
  isFavorited: boolean;
}

export interface ExerciseDetail extends Exercise {
  userRating: number | null;
}