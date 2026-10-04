export interface Workout {
  id: string;
  name: string;
  date: string;
  exercises?: WorkoutExercise[];
}
export interface WorkoutExercise {
  id: string;
  name: string;
  sets: number | null;
  reps: number | null;
  order: number;
  completed: boolean;
}