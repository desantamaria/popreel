import { VideoAggregation } from "@/db/schema";
import { create } from "zustand";

interface Videos {
  videos: VideoAggregation[];
  setVideos: (videos: VideoAggregation[]) => void;
}

export const useVideoStore = create<Videos>((set) => ({
  videos: [],
  setVideos: (videos: VideoAggregation[]) => set({ videos: videos }),
}));
