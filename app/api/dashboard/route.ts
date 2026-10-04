import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function getDayRange(base: Date) {
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

// Monday-start week
function getWeekRange(base: Date) {
  const day = base.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const monday = new Date(
    base.getFullYear(),
    base.getMonth(),
    base.getDate() + diffToMonday
  );
  const nextMonday = new Date(
    monday.getFullYear(),
    monday.getMonth(),
    monday.getDate() + 7
  );

  return { start: monday, end: nextMonday };
}

function computeCompletion(
  exercises: { sets: number | null; completed: boolean }[]
) {
  const totalSets = exercises.reduce(
    (sum, e) => sum + (e.sets ?? 0),
    0
  );

  if (totalSets > 0) {
    const completedSets = exercises
      .filter((e) => e.completed)
      .reduce((sum, e) => sum + (e.sets ?? 0), 0);

    return {
      percent: Math.round((completedSets / totalSets) * 100),
      completedSets,
      totalSets,
    };
  }

  const totalExercises = exercises.length;
  const completedExercises = exercises.filter(
    (e) => e.completed
  ).length;

  return {
    percent:
      totalExercises > 0
        ? Math.round((completedExercises / totalExercises) * 100)
        : 0,
    completedSets: completedExercises,
    totalSets: totalExercises,
  };
}

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

    const now = new Date();
    const today = getDayRange(now);
    const week = getWeekRange(now);

    // TODAY'S WORKOUT

    const todayWorkout = await prisma.workout.findFirst({
      where: {
        userId: user.id,
        date: {
          gte: today.start,
          lt: today.end,
        },
      },
      include: {
        exercises: true,
      },
    });

    let muscleGroups: string[] = [];

    if (todayWorkout && todayWorkout.exercises.length > 0) {
      const names = todayWorkout.exercises.map((e) => e.name);

      const matched = await prisma.exercise.findMany({
        where: {
          name: {
            in: names,
          },
        },
        select: {
          muscleGroup: true,
        },
      });

      muscleGroups = Array.from(
        new Set(matched.map((m) => m.muscleGroup))
      );
    }

    // WEEK CONSISTENCY

    const weekWorkouts = await prisma.workout.findMany({
      where: {
        userId: user.id,
        date: {
          gte: week.start,
          lt: week.end,
        },
      },
      include: {
        exercises: true,
      },
    });

    const weekDays = Array.from({ length: 7 }).map((_, i) => {
      const day = new Date(
        week.start.getFullYear(),
        week.start.getMonth(),
        week.start.getDate() + i
      );

      const workout = weekWorkouts.find((w) => {
        const wd = new Date(w.date);
        return (
          wd.getFullYear() === day.getFullYear() &&
          wd.getMonth() === day.getMonth() &&
          wd.getDate() === day.getDate()
        );
      });

      const isToday =
        day.getFullYear() === now.getFullYear() &&
        day.getMonth() === now.getMonth() &&
        day.getDate() === now.getDate();

      return {
        date: day.toISOString(),
        isToday,
        hasWorkout: Boolean(workout),
        percent: workout
          ? computeCompletion(workout.exercises).percent
          : 0,
      };
    });

    // RECENT ACTIVITY

    const recentWorkouts = await prisma.workout.findMany({
      where: {
        userId: user.id,
        date: {
          lt: today.start,
        },
      },
      orderBy: {
        date: "desc",
      },
      take: 5,
      include: {
        exercises: true,
      },
    });

    const recentActivity = recentWorkouts.map((workout) => ({
      id: workout.id,
      name: workout.name,
      date: workout.date.toISOString(),
      percent: computeCompletion(workout.exercises).percent,
    }));

    // NUTRITION (TODAY)

    const [target, entries] = await Promise.all([
      prisma.nutritionTarget.findUnique({
        where: {
          userId: user.id,
        },
      }),
      prisma.nutritionEntry.findMany({
        where: {
          userId: user.id,
          date: {
            gte: today.start,
            lt: today.end,
          },
        },
      }),
    ]);

    const consumed = entries.reduce(
      (acc, entry) => ({
        calories: acc.calories + entry.calories,
        protein: acc.protein + entry.protein,
      }),
      { calories: 0, protein: 0 }
    );

    return NextResponse.json({
      todayWorkout: todayWorkout
        ? {
            id: todayWorkout.id,
            name: todayWorkout.name,
            muscleGroups,
            ...computeCompletion(todayWorkout.exercises),
          }
        : null,
      weekDays,
      recentActivity,
      nutrition: {
        target: target
          ? { calories: target.calories, protein: target.protein }
          : null,
        consumed,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch dashboard" },
      { status: 500 }
    );
  }
}