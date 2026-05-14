import { create } from "zustand";

type UIState = {
  darkMode: boolean;
  menuOpen: boolean;
  setDarkMode: (value: boolean) => void;
  setMenuOpen: (value: boolean) => void;
};

export const useUIStore = create<UIState>((set) => ({
  darkMode: false,
  menuOpen: false,
  setDarkMode: (value) => set({ darkMode: value }),
  setMenuOpen: (value) => set({ menuOpen: value })
}));
