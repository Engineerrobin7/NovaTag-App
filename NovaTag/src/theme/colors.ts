/**
 * NovaTag Color System
 * Brand: InfyNova — dark-tech palette with teal/blue accents
 */

export const palette = {
  // ─── Brand ────────────────────────────────────────────────────────────────
  teal50:  '#e6fafa',
  teal100: '#b3f0f0',
  teal200: '#80e6e6',
  teal300: '#4ddcdc',
  teal400: '#26d4d4',
  teal500: '#00cccc', // Primary brand teal
  teal600: '#00aaaa',
  teal700: '#008888',
  teal800: '#006666',
  teal900: '#004444',

  blue50:  '#e6f0ff',
  blue100: '#b3d1ff',
  blue200: '#80b3ff',
  blue300: '#4d94ff',
  blue400: '#267aff',
  blue500: '#0066ff', // Primary brand blue
  blue600: '#0052cc',
  blue700: '#003d99',
  blue800: '#002966',
  blue900: '#001433',

  // ─── Neutrals ─────────────────────────────────────────────────────────────
  white:   '#ffffff',
  gray50:  '#f8f9fa',
  gray100: '#f1f3f5',
  gray200: '#e9ecef',
  gray300: '#dee2e6',
  gray400: '#ced4da',
  gray500: '#adb5bd',
  gray600: '#868e96',
  gray700: '#495057',
  gray800: '#343a40',
  gray900: '#212529',
  black:   '#0a0a0a',

  // ─── Dark surface palette ─────────────────────────────────────────────────
  dark50:  '#1a1d21',
  dark100: '#16191d',
  dark200: '#131619',
  dark300: '#0f1215',
  dark400: '#0c0e11',
  dark500: '#08090b',

  // ─── Semantic ─────────────────────────────────────────────────────────────
  success: '#00c853',
  warning: '#ffab00',
  error:   '#ff3d57',
  info:    '#00b0ff',
} as const;

export const lightColors = {
  // Backgrounds
  background:        palette.gray50,
  backgroundElevated: palette.white,
  backgroundCard:    palette.white,
  backgroundOverlay: 'rgba(0,0,0,0.4)',

  // Surfaces
  surface:           palette.white,
  surfaceSecondary:  palette.gray100,
  surfaceTertiary:   palette.gray200,

  // Text
  textPrimary:       palette.gray900,
  textSecondary:     palette.gray600,
  textTertiary:      palette.gray500,
  textInverse:       palette.white,
  textDisabled:      palette.gray400,

  // Brand
  primary:           palette.teal500,
  primaryLight:      palette.teal100,
  primaryDark:       palette.teal700,
  accent:            palette.blue500,
  accentLight:       palette.blue100,

  // Borders
  border:            palette.gray200,
  borderStrong:      palette.gray300,

  // Status
  success:           palette.success,
  warning:           palette.warning,
  error:             palette.error,
  info:              palette.info,

  // Navigation
  tabBar:            palette.white,
  tabBarBorder:      palette.gray200,
  tabBarActive:      palette.teal500,
  tabBarInactive:    palette.gray400,

  // Tracker status
  connected:         palette.success,
  disconnected:      palette.gray400,
  connecting:        palette.warning,
} as const;

export const darkColors: typeof lightColors = {
  // Backgrounds
  background:        palette.dark300,
  backgroundElevated: palette.dark200,
  backgroundCard:    palette.dark100,
  backgroundOverlay: 'rgba(0,0,0,0.7)',

  // Surfaces
  surface:           palette.dark100,
  surfaceSecondary:  palette.dark200,
  surfaceTertiary:   palette.dark300,

  // Text
  textPrimary:       palette.gray50,
  textSecondary:     palette.gray400,
  textTertiary:      palette.gray500,
  textInverse:       palette.gray900,
  textDisabled:      palette.gray700,

  // Brand
  primary:           palette.teal400,
  primaryLight:      'rgba(0,204,204,0.15)',
  primaryDark:       palette.teal600,
  accent:            palette.blue400,
  accentLight:       'rgba(0,102,255,0.15)',

  // Borders
  border:            palette.dark50,
  borderStrong:      palette.gray700,

  // Status
  success:           palette.success,
  warning:           palette.warning,
  error:             palette.error,
  info:              palette.info,

  // Navigation
  tabBar:            palette.dark100,
  tabBarBorder:      palette.dark50,
  tabBarActive:      palette.teal400,
  tabBarInactive:    palette.gray600,

  // Tracker status
  connected:         palette.success,
  disconnected:      palette.gray600,
  connecting:        palette.warning,
} as const;

export type AppColors = typeof lightColors;
