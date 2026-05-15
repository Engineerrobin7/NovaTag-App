import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { lightColors, darkColors, type AppColors } from './colors';
import { typography } from './typography';
import { spacing, radius, shadow } from './spacing';
import { useSettingsStore } from '@store/settingsStore';

export interface AppTheme {
  colors: AppColors;
  typography: typeof typography;
  spacing: typeof spacing;
  radius: typeof radius;
  shadow: typeof shadow;
  isDark: boolean;
}

const buildTheme = (isDark: boolean): AppTheme => ({
  colors: isDark ? darkColors : lightColors,
  typography,
  spacing,
  radius,
  shadow,
  isDark,
});

const ThemeContext = createContext<AppTheme>(buildTheme(false));

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemScheme = useColorScheme();
  const themeMode = useSettingsStore((s) => s.settings.themeMode);

  const isDark = useMemo(() => {
    if (themeMode === 'dark') return true;
    if (themeMode === 'light') return false;
    return systemScheme === 'dark';
  }, [themeMode, systemScheme]);

  const theme = useMemo(() => buildTheme(isDark), [isDark]);

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): AppTheme => useContext(ThemeContext);

export { lightColors, darkColors, typography, spacing, radius, shadow };
export type { AppColors };
