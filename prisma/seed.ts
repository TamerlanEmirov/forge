import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const exercises = [
  // ==========================================
  // CHEST
  // ==========================================

  {
    name: "Bench Press",
    muscleGroup: "Chest",
    secondaryMuscles: "Triceps, Front Shoulders",
    equipment: "Barbell",
    description:
      "A fundamental compound exercise for building strength and muscle in the chest, with significant involvement from the triceps and front shoulders.",
    videoUrl:
      "https://www.youtube.com/watch?v=rT7rgXQtDcI",
    thumbnailUrl: null,
    averageRating: 4.8,
    ratingCount: 1240,
  },

  {
    name: "Incline Dumbbell Press",
    muscleGroup: "Chest",
    secondaryMuscles: "Front Shoulders, Triceps",
    equipment: "Dumbbells",
    description:
      "A pressing movement that emphasizes the upper portion of the chest while also training the front shoulders and triceps.",
    videoUrl:
      "https://www.youtube.com/watch?v=8iPEnn-ltC8",
    thumbnailUrl: null,
    averageRating: 4.7,
    ratingCount: 860,
  },

  {
    name: "Dumbbell Fly",
    muscleGroup: "Chest",
    secondaryMuscles: "Front Shoulders",
    equipment: "Dumbbells",
    description:
      "An isolation-focused chest exercise designed to increase chest activation through a wide range of motion.",
    videoUrl:
      "https://www.youtube.com/watch?v=eozdVDA78K0",
    thumbnailUrl: null,
    averageRating: 4.5,
    ratingCount: 530,
  },

  {
    name: "Push Up",
    muscleGroup: "Chest",
    secondaryMuscles: "Triceps, Front Shoulders",
    equipment: "Bodyweight",
    description:
      "A simple and effective bodyweight pushing exercise that develops the chest, triceps and shoulders.",
    videoUrl:
      "https://www.youtube.com/watch?v=IODxDxX7oi4",
    thumbnailUrl: null,
    averageRating: 4.9,
    ratingCount: 2100,
  },

  {
    name: "Cable Crossover",
    muscleGroup: "Chest",
    secondaryMuscles: "Front Shoulders",
    equipment: "Cable",
    description:
      "A cable-based chest isolation movement that provides constant tension throughout the movement.",
    videoUrl:
      "https://www.youtube.com/watch?v=taI4XduLpTk",
    thumbnailUrl: null,
    averageRating: 4.6,
    ratingCount: 640,
  },

  // ==========================================
  // BACK
  // ==========================================

  {
    name: "Deadlift",
    muscleGroup: "Back",
    secondaryMuscles: "Glutes, Hamstrings, Traps, Core",
    equipment: "Barbell",
    description:
      "A major compound movement that develops the posterior chain, especially the back, glutes and hamstrings.",
    videoUrl:
      "https://www.youtube.com/watch?v=op9kVnSso6Q",
    thumbnailUrl: null,
    averageRating: 4.9,
    ratingCount: 1800,
  },

  {
    name: "Barbell Row",
    muscleGroup: "Back",
    secondaryMuscles: "Biceps, Rear Shoulders",
    equipment: "Barbell",
    description:
      "A compound pulling exercise that develops overall back thickness and strength.",
    videoUrl:
      "https://www.youtube.com/watch?v=FWJR5Ve8bnQ",
    thumbnailUrl: null,
    averageRating: 4.8,
    ratingCount: 970,
  },

  {
    name: "Lat Pulldown",
    muscleGroup: "Back",
    secondaryMuscles: "Biceps, Rear Shoulders",
    equipment: "Cable Machine",
    description:
      "A vertical pulling exercise that primarily targets the latissimus dorsi and helps develop back width.",
    videoUrl:
      "https://www.youtube.com/watch?v=CAwf7n6Luuc",
    thumbnailUrl: null,
    averageRating: 4.8,
    ratingCount: 1450,
  },

  {
    name: "Pull Up",
    muscleGroup: "Back",
    secondaryMuscles: "Biceps, Rear Shoulders, Core",
    equipment: "Bodyweight",
    description:
      "A bodyweight vertical pulling exercise that strongly targets the lats and upper back.",
    videoUrl:
      "https://www.youtube.com/watch?v=eGo4IYlbE5g",
    thumbnailUrl: null,
    averageRating: 4.9,
    ratingCount: 1650,
  },

  {
    name: "Seated Cable Row",
    muscleGroup: "Back",
    secondaryMuscles: "Biceps, Rear Shoulders",
    equipment: "Cable Machine",
    description:
      "A controlled horizontal pulling exercise that develops the middle and upper back.",
    videoUrl:
      "https://www.youtube.com/watch?v=GZbfZ033f74",
    thumbnailUrl: null,
    averageRating: 4.7,
    ratingCount: 780,
  },

  // ==========================================
  // SHOULDERS
  // ==========================================

  {
    name: "Overhead Press",
    muscleGroup: "Shoulders",
    secondaryMuscles: "Triceps, Upper Chest, Core",
    equipment: "Barbell",
    description:
      "A compound pressing exercise that primarily develops the shoulders and overall upper-body pressing strength.",
    videoUrl:
      "https://www.youtube.com/watch?v=2yjwXTZQDDI",
    thumbnailUrl: null,
    averageRating: 4.8,
    ratingCount: 920,
  },

  {
    name: "Dumbbell Shoulder Press",
    muscleGroup: "Shoulders",
    secondaryMuscles: "Triceps, Upper Chest",
    equipment: "Dumbbells",
    description:
      "A dumbbell pressing movement that targets all three heads of the shoulder with emphasis on the front and middle deltoids.",
    videoUrl:
      "https://www.youtube.com/watch?v=qEwKCR5JCog",
    thumbnailUrl: null,
    averageRating: 4.7,
    ratingCount: 810,
  },

  {
    name: "Lateral Raise",
    muscleGroup: "Shoulders",
    secondaryMuscles: "Traps",
    equipment: "Dumbbells",
    description:
      "An isolation exercise primarily targeting the lateral deltoids to improve shoulder width.",
    videoUrl:
      "https://www.youtube.com/watch?v=3VcKaXpzqRo",
    thumbnailUrl: null,
    averageRating: 4.9,
    ratingCount: 1900,
  },

  {
    name: "Face Pull",
    muscleGroup: "Shoulders",
    secondaryMuscles: "Rear Shoulders, Traps",
    equipment: "Cable Machine",
    description:
      "A cable exercise focused on the rear deltoids and upper back that can support healthy shoulder mechanics.",
    videoUrl:
      "https://www.youtube.com/watch?v=rep-qVOkqgk",
    thumbnailUrl: null,
    averageRating: 4.8,
    ratingCount: 1100,
  },

  // ==========================================
  // LEGS
  // ==========================================

  {
    name: "Barbell Squat",
    muscleGroup: "Legs",
    secondaryMuscles: "Glutes, Hamstrings, Core",
    equipment: "Barbell",
    description:
      "A fundamental lower-body compound movement targeting the quadriceps and glutes while involving the hamstrings and core.",
    videoUrl:
      "https://www.youtube.com/watch?v=SW_C1A-rejs",
    thumbnailUrl: null,
    averageRating: 4.9,
    ratingCount: 2200,
  },

  {
    name: "Leg Press",
    muscleGroup: "Legs",
    secondaryMuscles: "Glutes, Hamstrings",
    equipment: "Machine",
    description:
      "A machine-based compound movement that primarily targets the quadriceps while also training the glutes and hamstrings.",
    videoUrl:
      "https://www.youtube.com/watch?v=IZxyjW7MPJQ",
    thumbnailUrl: null,
    averageRating: 4.7,
    ratingCount: 930,
  },

  {
    name: "Romanian Deadlift",
    muscleGroup: "Legs",
    secondaryMuscles: "Glutes, Lower Back",
    equipment: "Barbell",
    description:
      "A hip-hinge movement that strongly targets the hamstrings and glutes.",
    videoUrl:
      "https://www.youtube.com/watch?v=JCXUYuzwNrM",
    thumbnailUrl: null,
    averageRating: 4.8,
    ratingCount: 870,
  },

  {
    name: "Leg Extension",
    muscleGroup: "Legs",
    secondaryMuscles: null,
    equipment: "Machine",
    description:
      "An isolation exercise that specifically targets the quadriceps.",
    videoUrl:
      "https://www.youtube.com/watch?v=YyvSfVjQeL0",
    thumbnailUrl: null,
    averageRating: 4.6,
    ratingCount: 620,
  },

  {
    name: "Leg Curl",
    muscleGroup: "Legs",
    secondaryMuscles: "Calves",
    equipment: "Machine",
    description:
      "An isolation exercise designed to strengthen and develop the hamstrings.",
    videoUrl:
      "https://www.youtube.com/watch?v=1Tq3QdYUuHs",
    thumbnailUrl: null,
    averageRating: 4.6,
    ratingCount: 590,
  },

  {
    name: "Standing Calf Raise",
    muscleGroup: "Legs",
    secondaryMuscles: null,
    equipment: "Machine",
    description:
      "A calf-focused movement targeting the gastrocnemius and supporting lower-leg strength.",
    videoUrl:
      "https://www.youtube.com/watch?v=gwLzBJYoWlI",
    thumbnailUrl: null,
    averageRating: 4.7,
    ratingCount: 540,
  },

  // ==========================================
  // BICEPS
  // ==========================================

  {
    name: "Barbell Curl",
    muscleGroup: "Biceps",
    secondaryMuscles: "Forearms",
    equipment: "Barbell",
    description:
      "A classic biceps exercise that allows progressive loading and focuses on elbow flexion strength.",
    videoUrl:
      "https://www.youtube.com/watch?v=kwG2ipFRgfo",
    thumbnailUrl: null,
    averageRating: 4.8,
    ratingCount: 1020,
  },

  {
    name: "Dumbbell Curl",
    muscleGroup: "Biceps",
    secondaryMuscles: "Forearms",
    equipment: "Dumbbells",
    description:
      "A simple biceps exercise allowing each arm to work independently.",
    videoUrl:
      "https://www.youtube.com/watch?v=ykJmrZ5v0Oo",
    thumbnailUrl: null,
    averageRating: 4.7,
    ratingCount: 890,
  },

  {
    name: "Hammer Curl",
    muscleGroup: "Biceps",
    secondaryMuscles: "Brachialis, Forearms",
    equipment: "Dumbbells",
    description:
      "A neutral-grip curl that strongly involves the brachialis and forearms alongside the biceps.",
    videoUrl:
      "https://www.youtube.com/watch?v=zC3nLlEvin4",
    thumbnailUrl: null,
    averageRating: 4.9,
    ratingCount: 1350,
  },

  // ==========================================
  // TRICEPS
  // ==========================================

  {
    name: "Tricep Pushdown",
    muscleGroup: "Triceps",
    secondaryMuscles: null,
    equipment: "Cable Machine",
    description:
      "A cable isolation movement targeting the triceps through elbow extension.",
    videoUrl:
      "https://www.youtube.com/watch?v=2-LAMcpzODU",
    thumbnailUrl: null,
    averageRating: 4.8,
    ratingCount: 1280,
  },

  {
    name: "Skull Crusher",
    muscleGroup: "Triceps",
    secondaryMuscles: "Forearms",
    equipment: "EZ Bar",
    description:
      "A lying triceps extension exercise that places significant emphasis on the triceps.",
    videoUrl:
      "https://www.youtube.com/watch?v=d_KZxkY_0cM",
    thumbnailUrl: null,
    averageRating: 4.6,
    ratingCount: 740,
  },

  {
    name: "Dips",
    muscleGroup: "Triceps",
    secondaryMuscles: "Chest, Front Shoulders",
    equipment: "Bodyweight",
    description:
      "A compound bodyweight exercise that can emphasize either the triceps or chest depending on technique.",
    videoUrl:
      "https://www.youtube.com/watch?v=2z8JmcrW-As",
    thumbnailUrl: null,
    averageRating: 4.9,
    ratingCount: 1500,
  },

  // ==========================================
  // CORE
  // ==========================================

  {
    name: "Plank",
    muscleGroup: "Core",
    secondaryMuscles: "Shoulders, Glutes",
    equipment: "Bodyweight",
    description:
      "An isometric core exercise that develops trunk stability and endurance.",
    videoUrl:
      "https://www.youtube.com/watch?v=pSHjTRCQxIw",
    thumbnailUrl: null,
    averageRating: 4.8,
    ratingCount: 1300,
  },

  {
    name: "Hanging Leg Raise",
    muscleGroup: "Core",
    secondaryMuscles: "Hip Flexors, Forearms",
    equipment: "Pull Up Bar",
    description:
      "A demanding core exercise performed from a hanging position with emphasis on the abdominal muscles.",
    videoUrl:
      "https://www.youtube.com/watch?v=Pr1ieGZ5atk",
    thumbnailUrl: null,
    averageRating: 4.7,
    ratingCount: 760,
  },

  {
    name: "Cable Crunch",
    muscleGroup: "Core",
    secondaryMuscles: null,
    equipment: "Cable Machine",
    description:
      "A weighted abdominal exercise that allows progressive resistance for the core.",
    videoUrl:
      "https://www.youtube.com/watch?v=2fbujeH3F0E",
    thumbnailUrl: null,
    averageRating: 4.6,
    ratingCount: 510,
  },
];

async function main() {
  console.log("🌱 Starting exercise seed...");

  // Yalnız Exercise datasını təmizləyirik.
  // Digər table-lərə toxunulmur.
  await prisma.exercise.deleteMany();

  const result = await prisma.exercise.createMany({
    data: exercises,
  });

  console.log(
    `✅ ${result.count} exercises successfully seeded.`
  );
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:");
    console.error(error);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });