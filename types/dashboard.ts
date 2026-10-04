export interface DashboardData {
  todayWorkout: {
    id: string;
    name: string;
    muscleGroups: string[];
    percent: number;
    completedSets: number;
    totalSets: number;
  } | null;
  weekDays: {
    date: string;
    isToday: boolean;
    hasWorkout: boolean;
    percent: number;
  }[];
  recentActivity: {
    id: string;
    name: string;
    date: string;
    percent: number;
  }[];
  nutrition: {
    target: { calories: number; protein: number } | null;
    consumed: { calories: number; protein: number };
  };
}