import { Platform } from 'react-native';

const fontFamily = Platform.select({
  ios: {
    regular: 'SF Pro Text',
    medium: 'SF Pro Text',
    semibold: 'SF Pro Text',
    bold: 'SF Pro Display',
    mono: 'SF Mono',
  },
  android: {
    regular: 'Roboto',
    medium: 'Roboto-Medium',
    semibold: 'Roboto-Medium',
    bold: 'Roboto-Bold',
    mono: 'RobotoMono-Regular',
  },
  default: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
    mono: 'monospace',
  },
})!;

export const typography = {
  // Display
  displayLarge: {
    fontFamily: fontFamily.bold,
    fontSize: 40,
    lineHeight: 48,
    letterSpacing: -1,
    fontWeight: '700' as const,
  },
  displayMedium: {
    fontFamily: fontFamily.bold,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.5,
    fontWeight: '700' as const,
  },
  displaySmall: {
    fontFamily: fontFamily.bold,
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: -0.25,
    fontWeight: '700' as const,
  },

  // Headings
  headingLarge: {
    fontFamily: fontFamily.bold,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.25,
    fontWeight: '700' as const,
  },
  headingMedium: {
    fontFamily: fontFamily.semibold,
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: -0.1,
    fontWeight: '600' as const,
  },
  headingSmall: {
    fontFamily: fontFamily.semibold,
    fontSize: 17,
    lineHeight: 24,
    letterSpacing: -0.1,
    fontWeight: '600' as const,
  },

  // Body
  bodyLarge: {
    fontFamily: fontFamily.regular,
    fontSize: 17,
    lineHeight: 26,
    letterSpacing: 0,
    fontWeight: '400' as const,
  },
  bodyMedium: {
    fontFamily: fontFamily.regular,
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: 0,
    fontWeight: '400' as const,
  },
  bodySmall: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    lineHeight: 20,
    letterSpacing: 0,
    fontWeight: '400' as const,
  },

  // Labels
  labelLarge: {
    fontFamily: fontFamily.medium,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 0.1,
    fontWeight: '500' as const,
  },
  labelMedium: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.1,
    fontWeight: '500' as const,
  },
  labelSmall: {
    fontFamily: fontFamily.medium,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.5,
    fontWeight: '500' as const,
  },

  // Caption
  caption: {
    fontFamily: fontFamily.regular,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.4,
    fontWeight: '400' as const,
  },

  // Mono (for debug/technical values)
  mono: {
    fontFamily: fontFamily.mono,
    fontSize: 13,
    lineHeight: 20,
    letterSpacing: 0,
    fontWeight: '400' as const,
  },
} as const;

export type TypographyKey = keyof typeof typography;
