import { VideoMetadata } from "@/lib/services/video";
import { create } from "zustand";

interface Videos {
  videos: VideoMetadata[];
  setVideos: (videos: VideoMetadata[]) => void;
}

export const useVideoStore = create<Videos>((set) => ({
  videos: [],
  setVideos: (videos: VideoMetadata[]) => set({ videos: videos }),
}));
