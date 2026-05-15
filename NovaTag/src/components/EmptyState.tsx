import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { useTheme } from '@theme/index';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
}) => {
  const { colors, typography, spacing } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing['2xl'],
      }}
    >
      {/* Illustration */}
      <Svg width={80} height={80} viewBox="0 0 80 80" style={{ marginBottom: spacing.xl }}>
        <Circle cx="40" cy="40" r="38" fill={colors.surfaceSecondary} />
        <Circle cx="40" cy="40" r="28" fill="none" stroke={colors.border} strokeWidth="1.5" strokeDasharray="4 4" />
        <Circle cx="40" cy="40" r="6" fill={colors.primary} opacity={0.4} />
        <Circle cx="40" cy="40" r="3" fill={colors.primary} />
      </Svg>

      <Text
        style={[
          typography.headingMedium,
          { color: colors.textPrimary, textAlign: 'center', marginBottom: spacing.sm },
        ]}
      >
        {title}
      </Text>
      <Text
        style={[
          typography.bodyMedium,
          {
            color: colors.textSecondary,
            textAlign: 'center',
            lineHeight: 22,
            marginBottom: spacing.xl,
          },
        ]}
      >
        {description}
      </Text>

      {actionLabel && onAction && (
        <Button label={actionLabel} onPress={onAction} size="md" />
      )}
    </View>
  );
};
