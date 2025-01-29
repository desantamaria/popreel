"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/custom-carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { categoriesList } from "@/lib/categories";
import { completeOnboarding } from "@/app/onboarding/_actions";

const MINIMUM_SELECTIONS = 3;

export default function OnboardingCarousel() {
  const [username, setUsername] = useState<string>("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [email, setEmail] = useState<string>("");

  const { user } = useUser();
  const router = useRouter();

  const handleSubmit = async () => {
    if (
      selectedInterests.length < MINIMUM_SELECTIONS ||
      username.length < 2 ||
      !isValidEmail(email)
    ) {
      toast.error("Please complete all steps before submitting.");
      return;
    }

    const res = await completeOnboarding({
      username,
      selectedInterests,
      email,
    });
    if (res?.message) {
      await user?.reload();
      router.push("/feed");
    }
    if (res?.error) {
      toast.error(`An unexpected error occurred: ${res?.error}`);
    }
  };

  const toggleInterest = (label: string) => {
    setSelectedInterests((prev) => {
      if (prev.includes(label)) {
        return prev.filter((item) => item !== label);
      }
      return [...prev, label];
    });
  };

  const isEmailValid = isValidEmail(email);
  const isUsernameValid = username.length >= 2;
  const areInterestsValid = selectedInterests.length >= MINIMUM_SELECTIONS;

  return (
    <div className="min-h-screen bg-background p-6 md:p-12 flex items-center justify-center">
      <Card className="w-full max-w-4xl">
        <CardContent className="p-6 md:p-12">
          <Carousel className="w-full">
            <CarouselContent>
              {/* Username Step */}
              <CarouselItem>
                <div className="p-4">
                  <h2 className="text-2xl font-bold mb-4">Choose a username</h2>
                  <Input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mb-4"
                  />
                  {!isUsernameValid && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Username must be at least 2 characters long.
                      </AlertDescription>
                    </Alert>
                  )}
                  <h2 className="text-2xl font-bold mb-4">Enter an email</h2>
                  <Input
                    type="text"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mb-4"
                  />
                  {!isEmailValid && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>Email is not valid.</AlertDescription>
                    </Alert>
                  )}
                </div>
              </CarouselItem>

              {/* Interests Step */}
              <CarouselItem>
                <div className="p-4">
                  <h2 className="text-2xl font-bold mb-4">
                    Choose your interests
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select at least {MINIMUM_SELECTIONS} interests to continue
                  </p>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {categoriesList.map((category) => {
                      const isSelected = selectedInterests.includes(
                        category.label
                      );
                      return (
                        <Button
                          key={category.label}
                          variant={isSelected ? "default" : "outline"}
                          className={`h-auto py-2 px-3 flex items-center justify-start gap-2 transition-all ${
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-accent hover:text-accent-foreground"
                          }`}
                          onClick={() => toggleInterest(category.label)}
                        >
                          <span className="text-lg">{category.emoji}</span>
                          <span className="text-sm font-medium">
                            {category.label}
                          </span>
                        </Button>
                      );
                    })}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {selectedInterests.length} of {MINIMUM_SELECTIONS} minimum
                    selections
                  </p>
                  {!areInterestsValid && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Please select at least {MINIMUM_SELECTIONS} interests.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CarouselItem>
            </CarouselContent>
            <div className="flex justify-center mt-4 gap-2">
              <CarouselPrevious size="default" />
              <CarouselNext size="default" />
            </div>
          </Carousel>

          <div className="mt-8 flex justify-center">
            <Button
              size="lg"
              className="px-12"
              onClick={handleSubmit}
              disabled={!isUsernameValid || !areInterestsValid}
            >
              Complete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function isValidEmail(email: string): boolean {
  const emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}
