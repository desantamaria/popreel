"use server";

import { createUser } from "@/db/operations";
import { auth, clerkClient } from "@clerk/nextjs/server";

type OnboardingData = {
  username: string;
  selectedInterests: string[];
};

export const completeOnboarding = async (onboardingData: OnboardingData) => {
  const { userId } = await auth();

  if (!userId) {
    return { message: "No Logged In User" };
  }

  const client = await clerkClient();

  try {
    const newUserId = await createUser({
      username: onboardingData.username,
      clerkId: userId,
      metadata: { selectedInterests: onboardingData.selectedInterests },
    });

    if (!newUserId) {
      throw new Error("An Error occurred while inserting new User");
    }

    const res = await client.users.updateUser(userId, {
      publicMetadata: {
        onboardingComplete: true,
        username: onboardingData.username,
        selectedInterests: onboardingData.selectedInterests,
      },
    });
    return { message: res.publicMetadata };
  } catch (err) {
    return { error: err };
  }
};
