import { prisma } from "./prisma";

export async function getOrCreateUser(
  clerkId: string,
  username: string,
  email: string
) {
  return prisma.user.upsert({
    where: {
      clerkId,
    },

    update: {
      username,
      email,
    },

    create: {
      clerkId,
      username,
      email,
    },
  });
}