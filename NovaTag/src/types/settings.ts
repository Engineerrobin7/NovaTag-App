export type ThemeMode = 'light' | 'dark' | 'system';

export interface AppSettings {
  themeMode: ThemeMode;
  notificationsEnabled: boolean;
  bleDebugMode: boolean;
  mockMode: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  themeMode: 'system',
  notificationsEnabled: true,
  bleDebugMode: false,
  mockMode: true,
};
