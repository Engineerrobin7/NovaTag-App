import React from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';
import { useTheme } from '@theme/index';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevated?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  elevated = false,
}) => {
  const { colors, radius, shadow, spacing } = useTheme();

  return (
    <View
      style={[
        {
          backgroundColor: colors.backgroundCard,
          borderRadius: radius.xl,
          padding: spacing.base,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
        },
        elevated && shadow.md,
        style,
      ]}
    >
      {children}
    </View>
  );
};
