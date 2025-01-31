"use server";

import { Logger } from "@/utils/logger";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { createUser, updateUserInterests } from "./user";

type OnboardingData = {
  username: string;
  selectedInterests: string[];
};

const logger = new Logger("actions:onboarding");

export const completeOnboarding = async (onboardingData: OnboardingData) => {
  const { userId } = await auth();

  if (!userId) {
    return { message: "No Logged In User" };
  }

  const user = await currentUser();
  const client = await clerkClient();

  if (!user?.primaryEmailAddress) {
    throw new Error("Invalid Email Address");
  }

  try {
    logger.info("Creating user record", { email: user.primaryEmailAddress });
    const newUserId = await createUser({
      username: onboardingData.username,
      id: userId,
      email: user.primaryEmailAddress.emailAddress,
      avatarUrl: user.imageUrl,
      metadata: { interests: onboardingData.selectedInterests },
    });

    if (!newUserId) {
      throw new Error("An Error occurred while inserting new User");
    }

    logger.info("Creating embeddings for user interests");
    await updateUserInterests(onboardingData.selectedInterests);

    logger.info("Marking Onboarding as Complete in User Metadata");
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
