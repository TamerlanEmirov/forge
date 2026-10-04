import { auth, currentUser } from "@clerk/nextjs/server";
import { getOrCreateUser } from "./user";

export async function getCurrentUser() {
  const { userId } = await auth.protect();

  const clerkUser = await currentUser();

  if (!clerkUser) {
    return null;
  }

  const username = clerkUser.username;
  const email = clerkUser.emailAddresses[0]?.emailAddress;

  if (!username || !email) {
    throw new Error("User is missing username or email");
  }

  return getOrCreateUser(userId, username, email);
}