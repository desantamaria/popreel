"use client";

import { completeOnboarding } from "@/app/onboarding/_actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { categories } from "@/lib/categories";
import { useUser } from "@clerk/nextjs";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
const MINIMUM_SELECTIONS = 3;

export default function OnboardingForm() {
  const [username, setUsername] = useState<string>("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const { user } = useUser();
  const router = useRouter();

  const handleSubmit = async () => {
    if (selectedInterests.length < MINIMUM_SELECTIONS && username.length < 2) {
      return;
    }

    const res = await completeOnboarding({ username, selectedInterests });
    if (res?.message) {
      await user?.reload();
      router.push("/feed");
    }
    if (res?.error) {
      toast(`An unexpected error occurred: ${res?.error}`);
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

  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <Card className="mx-auto max-w-5xl">
        <CardContent className="p-6 md:p-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Choose your interests</h1>
              <p className="text-muted-foreground text-lg">
                Get personalized video recommendations
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Select at least {MINIMUM_SELECTIONS} interests to continue
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((categories) => {
              const isSelected = selectedInterests.includes(categories.label);
              return (
                <Button
                  key={categories.label}
                  variant={isSelected ? "default" : "outline"}
                  className={`h-auto py-6 px-4 flex items-center justify-center gap-2 transition-all ${
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                  onClick={() => toggleInterest(categories.label)}
                >
                  <span className="text-2xl">{categories.emoji}</span>
                  <span className="text-base font-medium">
                    {categories.label}
                  </span>
                </Button>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col items-center gap-4">
            <p className="text-sm text-muted-foreground">
              {selectedInterests.length} of {MINIMUM_SELECTIONS} minimum
              selections
            </p>
            <Button
              size="lg"
              className="px-12"
              onClick={handleSubmit}
              disabled={selectedInterests.length < MINIMUM_SELECTIONS}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
