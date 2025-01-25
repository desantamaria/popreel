import { create } from "zustand";

export interface VideoDetailsStore {
  filename: string | null;
  size: string | null;
  uploaded: boolean;
  location: string | null;
  caption: string | null;
  categories: string[];
  videoUrl: string | null;
  setFilename: (filename: string | null) => void;
  setSize: (size: string | null) => void;
  setUploaded: (uploaded: boolean) => void;
  setLocation: (location: string | null) => void;
  setCaption: (caption: string | null) => void;
  setCategories: (categories: string[]) => void;
}

export const useVideoUploadStore = create<VideoDetailsStore>((set) => ({
  filename: null,
  size: null,
  uploaded: false,
  location: null,
  caption: null,
  categories: [],
  videoUrl: null,
  setLocation: (location: string | null) => set({ location: location }),
  setCaption: (caption: string | null) => set({ caption: caption }),
  setCategories: (categories: string[]) => set({ categories: categories }),
  setFilename: (filename: string | null) => set({ filename: filename }),
  setSize: (size: string | null) => set({ size: size }),
  setUploaded: (uploaded: boolean) => set({ uploaded: uploaded }),
}));
