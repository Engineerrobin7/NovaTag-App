import { create } from "zustand";
import { UserProfile } from "../types/user";

type AuthState = {
  user: UserProfile | null;
  initialized: boolean;
  setUser: (user: UserProfile | null) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  initialized: false,
  setUser: (user) => set({ user, initialized: true }),
  logout: () => set({ user: null })
}));
