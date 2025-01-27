"use client";

import { Button } from "@/components/ui/button";
import { categoriesList } from "@/lib/categories";
import { useVideoUploadStore } from "@/stores/video-upload-store";

export default function CategorySelect() {
  const { categories, setCategories } = useVideoUploadStore();

  const toggleInterest = (label: string) => {
    let prev = categories as string[];
    if (prev.includes(label)) {
      setCategories(prev.filter((item) => item !== label));
    } else {
      setCategories([...prev, label]);
    }
  };
  return (
    <div className="mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Choose Categories</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Select at least 1 category
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {categoriesList.map((category) => {
          const isSelected = categories.includes(category.label);
          return (
            <Button
              key={category.label}
              variant={isSelected ? "default" : "outline"}
              className={`h-auto py-3 px-1 flex items-center justify-center gap-2 transition-all ${
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent hover:text-accent-foreground"
              }`}
              onClick={() => toggleInterest(category.label)}
            >
              <span className="text-sm">{category.emoji}</span>
              <span className="text-base font-medium">{category.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
