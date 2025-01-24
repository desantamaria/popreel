import { create } from "zustand";

interface User {}

export const useOnboardingStore = create<User>((set, get) => ({}));
