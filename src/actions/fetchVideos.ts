"use server";

import { findSimilarVideos, getUser } from "@/db/operations";
import { isAuthenticated } from "@/helpers/isAuthenticated";

export async function FetchVideos() {
  const userId = await isAuthenticated();
  const userInfo = await getUser(userId);
  const recommendedVideos = await findSimilarVideos(
    JSON.stringify(userInfo.metadata)
  );
  return recommendedVideos;
}
