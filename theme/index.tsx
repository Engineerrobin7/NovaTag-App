import React, { createContext, ReactNode } from "react";
import { colors } from "./colors";
import { typography } from "./typography";

export const theme = {
  colors,
  typography,
  spacing: {
    micro: 6,
    compact: 12,
    base: 16,
    large: 24,
    xlarge: 34
  }
};

type ThemeContextType = typeof theme;
export const ThemeContext = createContext<ThemeContextType>(theme);

export function ThemeProvider({ children }: { children: ReactNode }) {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}
