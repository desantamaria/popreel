"use server";

import { getUser } from "@/db/operations";
import { isAuthenticated } from "@/helpers/isAuthenticated";

export async function FetchVideos() {
  const userId = await isAuthenticated();
  const userInfo = await getUser(userId);

  return [];
}
