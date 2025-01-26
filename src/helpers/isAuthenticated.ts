import { auth } from "@clerk/nextjs/server";

export async function isAuthenticated() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }
  return userId;
}
